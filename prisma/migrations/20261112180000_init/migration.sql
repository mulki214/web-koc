-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'FIGHTER');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FightStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Corner" AS ENUM ('RED', 'BLUE', 'DRAW', 'NO_CONTEST');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'FACEBOOK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ringName" TEXT,
    "portraitUrl" TEXT,
    "coverUrl" TEXT,
    "nationality" TEXT,
    "hometown" TEXT,
    "birthDate" TIMESTAMP(3),
    "showBirthDate" BOOLEAN NOT NULL DEFAULT false,
    "heightCm" INTEGER,
    "reachCm" INTEGER,
    "weightClass" TEXT,
    "stance" TEXT,
    "category" TEXT NOT NULL DEFAULT 'PROFESSIONAL',
    "coach" TEXT,
    "bio" TEXT,
    "gymId" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FighterSocialLink" (
    "id" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "FighterSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "category" TEXT,
    "posterUrl" TEXT,
    "venue" TEXT,
    "city" TEXT,
    "startsAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jakarta',
    "eventStatus" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "ticketUrl" TEXT,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "redFighterId" TEXT NOT NULL,
    "blueFighterId" TEXT NOT NULL,
    "boutOrder" INTEGER NOT NULL,
    "cardSection" TEXT NOT NULL DEFAULT 'UNDERCARD',
    "division" TEXT,
    "rounds" INTEGER,
    "matchType" TEXT,
    "status" "FightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FightResult" (
    "id" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "winner" "Corner" NOT NULL,
    "method" TEXT,
    "round" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "imported" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FightResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FighterApplication" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "privateData" JSONB NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FighterApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" TEXT NOT NULL,
    "coverUrl" TEXT,
    "authorName" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "attribution" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "eventId" TEXT,
    "fighterId" TEXT,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaIntegration" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "tokenCiphertext" TEXT,
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaAccount" (
    "id" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "handle" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "integrationId" TEXT,

    CONSTRAINT "SocialMediaAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMediaPost" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSponsor" (
    "eventId" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,

    CONSTRAINT "EventSponsor_pkey" PRIMARY KEY ("eventId","sponsorId")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToFighter" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToFighter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArticleToEvent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_name_key" ON "Gym"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_slug_key" ON "Fighter"("slug");

-- CreateIndex
CREATE INDEX "Fighter_status_weightClass_idx" ON "Fighter"("status", "weightClass");

-- CreateIndex
CREATE UNIQUE INDEX "FighterSocialLink_fighterId_provider_key" ON "FighterSocialLink"("fighterId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startsAt_idx" ON "Event"("status", "startsAt");

-- CreateIndex
CREATE INDEX "Fight_redFighterId_idx" ON "Fight"("redFighterId");

-- CreateIndex
CREATE INDEX "Fight_blueFighterId_idx" ON "Fight"("blueFighterId");

-- CreateIndex
CREATE UNIQUE INDEX "Fight_eventId_boutOrder_key" ON "Fight"("eventId", "boutOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FightResult_fightId_key" ON "FightResult"("fightId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_fighterId_key" ON "EventRegistration"("eventId", "fighterId");

-- CreateIndex
CREATE INDEX "FighterApplication_email_status_idx" ON "FighterApplication"("email", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegration_provider_key" ON "SocialMediaIntegration"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaAccount_provider_handle_key" ON "SocialMediaAccount"("provider", "handle");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaPost_url_key" ON "SocialMediaPost"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_name_key" ON "Sponsor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_createdAt_idx" ON "AuditLog"("entity", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "_ArticleToFighter_B_index" ON "_ArticleToFighter"("B");

-- CreateIndex
CREATE INDEX "_ArticleToEvent_B_index" ON "_ArticleToEvent"("B");

-- AddForeignKey
ALTER TABLE "Fighter" ADD CONSTRAINT "Fighter_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterSocialLink" ADD CONSTRAINT "FighterSocialLink_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightResult" ADD CONSTRAINT "FightResult_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaAccount" ADD CONSTRAINT "SocialMediaAccount_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "SocialMediaAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsor" ADD CONSTRAINT "EventSponsor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSponsor" ADD CONSTRAINT "EventSponsor_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToFighter" ADD CONSTRAINT "_ArticleToFighter_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToFighter" ADD CONSTRAINT "_ArticleToFighter_B_fkey" FOREIGN KEY ("B") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToEvent" ADD CONSTRAINT "_ArticleToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToEvent" ADD CONSTRAINT "_ArticleToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

