// lib/flowEngine.ts
import { prisma } from "./prisma";
import { sendWhatsAppTextMessage } from "./whatsapp";

// ---- Types voor de engine ----

type RunFlowsParams = {
  companyId: string;
  eventType: string;
  contact: {
    id?: string; // mag optioneel zijn, fallback in sendWhatsAppMessage
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  payload?: Record<string, any>;
};

type TemplateContext = {
  contact: RunFlowsParams["contact"];
  company: {
    id: string;
    name: string | null;
    whatsappNumber?: string | null;
  } | null;
  payload?: Record<string, any>;

  // ✔ Aliassen zodat {{name}}, {{email}}, {{phone}} ook werken
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

// Flow-definition zoals opgeslagen door de FlowBuilder
type FlowDefinitionBlockType = "trigger" | "whatsapp" | "wait" | "condition";

type FlowDefinitionBlock = {
  id: string;
  type: FlowDefinitionBlockType;
  label?: string | null;

  // trigger
  eventType?: string | null;

  // whatsapp
  template?: string | null;

  // wait
  minutes?: number | null;

  // condition
  expression?: string | null;
};

type FlowDefinition = {
  blocks: FlowDefinitionBlock[];
} | null;

// ---- Helpers ----

function getByPath(path: string, ctx: any) {
  return path.split(".").reduce((acc: any, part: string) => {
    if (acc == null) return undefined;
    return acc[part];
  }, ctx);
}

/**
 * Template renderer met dot-notation:
 *  - {{contact.name}}
 *  - {{company.name}}
 *  - {{payload.source}}
 *  - én aliassen als {{name}}, {{email}}, {{phone}}
 */
function renderTemplate(template: string, ctx: TemplateContext) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) => {
    const value = getByPath(key, ctx);
    return value == null ? "" : String(value);
  });
}

/**
 * Simpele condition-evaluator.
 *
 * Ondersteunt o.a.:
 *  - contact.tags bevat "VIP"
 *  - contact.score > 50
 *  - payload.source == "facebook"
 */
function evaluateCondition(
  expression: string | null | undefined,
  ctx: TemplateContext
): boolean {
  if (!expression || !expression.trim()) return false;

  const match = expression.match(
    /^\s*([\w.]+)\s*(==|!=|>=|<=|>|<|bevat|contains)\s*(.+)\s*$/i
  );

  if (!match) {
    console.warn("[flowEngine] Condition expression niet herkend:", expression);
    return false;
  }

  const [, leftPath, opRaw, rightRaw] = match;
  const op = opRaw.toLowerCase();

  const leftVal = getByPath(leftPath, ctx);

  let rightStr = rightRaw.trim();
  if (
    (rightStr.startsWith('"') && rightStr.endsWith('"')) ||
    (rightStr.startsWith("'") && rightStr.endsWith("'"))
  ) {
    rightStr = rightStr.slice(1, -1);
  }

  let rightVal: any = rightStr;
  if (/^\d+(\.\d+)?$/.test(rightStr)) {
    rightVal = Number(rightStr);
  } else if (rightStr.toLowerCase() === "true") {
    rightVal = true;
  } else if (rightStr.toLowerCase() === "false") {
    rightVal = false;
  }

  try {
    switch (op) {
      case "==":
        return leftVal == rightVal;
      case "!=":
        return leftVal != rightVal;
      case ">":
        return Number(leftVal) > Number(rightVal);
      case "<":
        return Number(leftVal) < Number(rightVal);
      case ">=":
        return Number(leftVal) >= Number(rightVal);
      case "<=":
        return Number(leftVal) <= Number(rightVal);
      case "bevat":
      case "contains":
        if (Array.isArray(leftVal)) {
          return leftVal.includes(rightVal);
        }
        if (typeof leftVal === "string") {
          return String(leftVal).includes(String(rightVal));
        }
        return false;
      default:
        console.warn("[flowEngine] Onbekende operator in condition:", op);
        return false;
    }
  } catch (e) {
    console.error("[flowEngine] Fout bij evalueren condition:", e);
    return false;
  }
}

/**
 * Normaliseer NL-telefoonnummers naar E.164 formaat (+316...)
 */
function normalizeDutchPhone(raw?: string | null): string | null {
  if (!raw) return null;

  // Spaties en streepjes weg
  let phone = raw.replace(/[\s-]+/g, "");

  // 00 → +
  if (phone.startsWith("00")) {
    phone = "+" + phone.slice(2);
  }

  // 06xxxxxxx → +316xxxxxxx
  if (phone.startsWith("0")) {
    phone = "+31" + phone.slice(1);
  }

  // 31xxxxxxx → +31xxxxxxx
  if (phone.startsWith("31") && !phone.startsWith("+31")) {
    phone = "+31" + phone.slice(2);
  }

  // Als het nog steeds niet met + begint → ongeldig
  if (!phone.startsWith("+")) {
    return null;
  }

  return phone;
}

// ---- WhatsApp helper ----

async function sendWhatsAppMessage(params: {
  companyId: string;
  contactId?: string; // optioneel
  content: string;
  context: TemplateContext;
}) {
  const { companyId, contactId, content, context } = params;

  if (!companyId) {
    console.error("[sendWhatsAppMessage] Missing companyId");
    throw new Error("Missing companyId in sendWhatsAppMessage");
  }

  const normalizedTo = normalizeDutchPhone(context.contact.phone);

  if (!normalizedTo) {
    console.warn(
      "[sendWhatsAppMessage] Ongeldig of ontbrekend telefoonnummer voor contact:",
      context.contact.phone
    );
  }

  // 1) Echte WhatsApp call (alleen als we een geldig telefoonnummer hebben)
  let waResult: { success: boolean; waMessageId?: string; error?: any } = {
    success: false,
  };

  if (normalizedTo) {
    waResult = await sendWhatsAppTextMessage({
      companyId, // ✅ belangrijk: multi-tenant config gebruiken
      to: normalizedTo,
      body: content,
    });
  }

  // 2) Bericht in eigen database opslaan
  const data: any = {
    direction: "OUTBOUND",
    status: waResult.success ? "SENT" : "FAILED",
    content,
    whatsappMessageId: waResult.waMessageId ?? null,
    rawPayload: {
      simulated: false,
      context,
      error: waResult.success ? null : waResult.error,
    },
    company: {
      connect: { id: companyId },
    },
  };

  if (contactId) {
    data.contact = { connect: { id: contactId } };
  } else {
    console.warn(
      "[sendWhatsAppMessage] No contactId provided, creating message without contact relation"
    );
  }

  const message = await prisma.message.create({ data });
  return message;
}

// ---- Hoofdfunctie: flows draaien voor event ----

export async function runFlowsForEvent({
  companyId,
  eventType,
  contact,
  payload = {},
}: RunFlowsParams) {
  console.log("[runFlowsForEvent] START", {
    companyId,
    eventType,
    contactPhone: contact.phone,
  });

  const flows = await prisma.flow.findMany({
    where: {
      companyId,
      triggerEventType: eventType,
      isActive: true,
    },
  });

  console.log("[runFlowsForEvent] flows gevonden:", flows.length);

  if (!flows.length) {
    return { triggeredFlows: 0, messagesSent: 0, messages: [] as any[] };
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  const context: TemplateContext = {
    contact,
    company,
    payload,
    name: contact.name ?? null,
    email: contact.email ?? null,
    phone: contact.phone ?? null,
  };

  let totalMessagesSent = 0;
  const allMessages: any[] = [];

  for (const flow of flows) {
    const definition = (flow as any).definition as FlowDefinition;

    if (definition && Array.isArray(definition.blocks)) {
      console.log(
        `[runFlowsForEvent] Executing definition for flow ${flow.id} (${flow.name})`
      );

      let lastConditionResult: boolean | null = null;

      for (const block of definition.blocks) {
        if (block.type === "condition") {
          const result = evaluateCondition(block.expression ?? "", context);
          lastConditionResult = result;
          console.log(
            `[runFlowsForEvent] Condition "${block.expression}" →`,
            result
          );
          continue;
        }

        if (block.type === "whatsapp") {
          if (lastConditionResult === false) {
            console.log(
              "[runFlowsForEvent] Condition was false → WhatsApp blok overgeslagen:",
              block.id
            );
            lastConditionResult = null;
            continue;
          }

          const template =
            block.template ??
            flow.messageTemplate ??
            "";

          const content = renderTemplate(template, context);

          console.log(
            "[runFlowsForEvent] WhatsApp block",
            block.id,
            "rendered content:",
            content
          );

          if (!content.trim()) {
            lastConditionResult = null;
            continue;
          }

          const message = await sendWhatsAppMessage({
            companyId,
            contactId: contact.id,
            content,
            context,
          });

          totalMessagesSent++;
          allMessages.push(message);
          lastConditionResult = null;
          continue;
        }

        if (block.type === "wait") {
          console.log(
            `[runFlowsForEvent] Wait block (${block.minutes} minuten) wordt nu nog niet echt uitgevoerd.`
          );
          lastConditionResult = null;
          continue;
        }

        if (block.type === "trigger") {
          console.log(
            `[runFlowsForEvent] Trigger block gezien (eventType=${block.eventType}).`
          );
          lastConditionResult = null;
          continue;
        }

        lastConditionResult = null;
      }
    } else {
      console.log(
        `[runFlowsForEvent] Flow ${flow.id} heeft geen definition; gebruik messageTemplate.`
      );

      const content = renderTemplate(flow.messageTemplate ?? "", context);
      if (!content.trim()) continue;

      const message = await sendWhatsAppMessage({
        companyId,
        contactId: contact.id,
        content,
        context,
      });

      totalMessagesSent++;
      allMessages.push(message);
    }
  }

  return {
    triggeredFlows: flows.length,
    messagesSent: totalMessagesSent,
    messages: allMessages,
  };
}
