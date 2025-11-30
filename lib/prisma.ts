// lib/prisma.ts

// Gebruik require zodat TypeScript niet moeilijk doet over de types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis as unknown as {
  prisma?: any;
};

const client =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = client;
}

// Prisma werkt prima, maar TS snapt de dynamische client soms niet goed,
// daarom een losse alias die we 'any' casten.
export const prisma = client as any;
