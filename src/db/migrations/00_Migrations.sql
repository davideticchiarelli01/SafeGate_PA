-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM Types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'gate');
CREATE TYPE badge_status AS ENUM ('active', 'suspended');
CREATE TYPE dpi AS ENUM ('helmet', 'gloves', 'vest');
CREATE TYPE transit_status AS ENUM ('authorized', 'unauthorized');

-- 1. Gates (no FK)
CREATE TABLE "Gates" (
                         "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         "name" VARCHAR NOT NULL,
                         "requiredDPIs" dpi[] DEFAULT '{}',
                         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (FK to Gates)
CREATE TABLE "Users" (
                         "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         "email" VARCHAR NOT NULL UNIQUE,
                         "password" VARCHAR NOT NULL,
                         "role" user_role NOT NULL DEFAULT 'user',
                         "linkedGateId" UUID UNIQUE,
                         "token" INTEGER NOT NULL DEFAULT 100,
                         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_users_linkedGate FOREIGN KEY ("linkedGateId") REFERENCES "Gates"("id") ON DELETE CASCADE
);

-- 3. Badges (FK to Users)
CREATE TABLE "Badges" (
                          "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          "userId" UUID NOT NULL UNIQUE,
                          "status" badge_status NOT NULL DEFAULT 'active',
                          "unauthorizedAttempts" INTEGER NOT NULL DEFAULT 0,
                          "firstUnauthorizedAttempt" TIMESTAMP,
                          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          CONSTRAINT fk_badges_user FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE
);

-- 4. Transits (FK to Gates e Badges)
CREATE TABLE "Transits" (
                            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            "gateId" UUID NOT NULL,
                            "badgeId" UUID NOT NULL,
                            "status" transit_status NOT NULL,
                            "usedDPIs" dpi[] DEFAULT '{}',
                            "DPIviolation" BOOLEAN NOT NULL DEFAULT FALSE,
                            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            CONSTRAINT fk_transits_gate FOREIGN KEY ("gateId") REFERENCES "Gates"("id") ON DELETE CASCADE,
                            CONSTRAINT fk_transits_badge FOREIGN KEY ("badgeId") REFERENCES "Badges"("id") ON DELETE CASCADE
);

-- 5. Authorizations (FK to Gates e Badges)
CREATE TABLE "Authorizations" (
                                  "badgeId" UUID NOT NULL,
                                  "gateId" UUID NOT NULL,
                                  PRIMARY KEY ("badgeId", "gateId"),
                                  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                  CONSTRAINT fk_authorization_badge FOREIGN KEY ("badgeId") REFERENCES "Badges"("id") ON DELETE CASCADE,
                                  CONSTRAINT fk_authorization_gate FOREIGN KEY ("gateId") REFERENCES "Gates"("id") ON DELETE CASCADE
);


