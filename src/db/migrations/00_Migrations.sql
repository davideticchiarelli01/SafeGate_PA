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
                         "name" VARCHAR NOT NULL UNIQUE,
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


-- === Insert into Gates ===
INSERT INTO "Gates" ("id", "name", "requiredDPIs", "createdAt", "updatedAt") VALUES
                                                                                 ('8a8e1f4d-bb7a-4b6e-bb44-7386228f637c', 'Gate A', ARRAY['helmet', 'vest']::dpi[], now(), now()),
                                                                                 ('5e3e4445-3a6e-4b83-9438-8ef7f5a2b9df', 'Gate B', ARRAY['gloves']::dpi[], now(), now());

-- === Insert into Users ===
INSERT INTO "Users" ("id", "email", "password", "role", "linkedGateId", "token", "createdAt", "updatedAt") VALUES
                                                                                                               ('b1b19876-bff4-42cd-90ae-0e497ff50c99', 'admin@example.com', 'hashed_password1', 'admin', NULL, 100, now(), now()),
                                                                                                               ('fa4d116f-7b3f-4c9d-88d6-8f01b36dc8c6', 'user@example.com', 'hashed_password2', 'user', NULL, 100, now(), now()),
                                                                                                               ('d2f221d7-22ad-45c8-a1aa-b6535e6c7dd7', 'gate@example.com', 'hashed_password3', 'gate', '8a8e1f4d-bb7a-4b6e-bb44-7386228f637c', 0, now(), now());

-- === Insert into Badges ===
INSERT INTO "Badges" ("id", "userId", "status", "unauthorizedAttempts", "firstUnauthorizedAttempt", "createdAt", "updatedAt") VALUES
                                                                                                                                  ('79c1f0c5-2cf8-4948-b51d-b4ef0117c68e', 'b1b19876-bff4-42cd-90ae-0e497ff50c99', 'active', 0, NULL, now(), now()),
                                                                                                                                  ('d70c2d10-b56c-4cbb-bb00-6c2f1e1cb723', 'fa4d116f-7b3f-4c9d-88d6-8f01b36dc8c6', 'active', 0, NULL, now(), now());

-- === Insert into Authorizations ===
INSERT INTO "Authorizations" ("badgeId", "gateId", "createdAt", "updatedAt") VALUES
                                                                                 ('79c1f0c5-2cf8-4948-b51d-b4ef0117c68e', '8a8e1f4d-bb7a-4b6e-bb44-7386228f637c', now(), now()),
                                                                                 ('79c1f0c5-2cf8-4948-b51d-b4ef0117c68e', '5e3e4445-3a6e-4b83-9438-8ef7f5a2b9df', now(), now()),
                                                                                 ('d70c2d10-b56c-4cbb-bb00-6c2f1e1cb723', '5e3e4445-3a6e-4b83-9438-8ef7f5a2b9df', now(), now());

-- === Insert into Transits ===
INSERT INTO "Transits" ("id", "gateId", "badgeId", "status", "usedDPIs", "DPIviolation", "createdAt", "updatedAt") VALUES
                                                                                                                       ('e799cf8f-3c32-49f1-8377-2f5a9e221e1c', '5e3e4445-3a6e-4b83-9438-8ef7f5a2b9df', '79c1f0c5-2cf8-4948-b51d-b4ef0117c68e', 'authorized', ARRAY['helmet', 'vest']::dpi[], false, now(), now()),
                                                                                                                       ('c4ad95bc-93c6-4f7b-8ab6-b33d084e0e6e', '8a8e1f4d-bb7a-4b6e-bb44-7386228f637c', 'd70c2d10-b56c-4cbb-bb00-6c2f1e1cb723', 'unauthorized', ARRAY['gloves']::dpi[], false, now(), now()),
                                                                                                                       ('f5dc8e61-b62b-4fc6-b9b2-4b46208ef87b', '8a8e1f4d-bb7a-4b6e-bb44-7386228f637c', 'd70c2d10-b56c-4cbb-bb00-6c2f1e1cb723', 'unauthorized', ARRAY['vest']::dpi[], true, now(), now());
