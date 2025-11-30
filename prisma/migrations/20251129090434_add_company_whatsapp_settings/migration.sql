-- CreateEnum
CREATE TYPE "WhatsAppStatus" AS ENUM ('PENDING', 'ACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "CompanyWhatsAppSettings" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "phoneNumberId" TEXT,
    "businessId" TEXT,
    "accessToken" TEXT,
    "verifyToken" TEXT,
    "status" "WhatsAppStatus" NOT NULL DEFAULT 'PENDING',
    "webhookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyWhatsAppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyWhatsAppSettings_companyId_key" ON "CompanyWhatsAppSettings"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyWhatsAppSettings" ADD CONSTRAINT "CompanyWhatsAppSettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
