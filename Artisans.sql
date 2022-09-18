-- TODO:
-- FK constraints
-- Implement adavance business users account for better discoverability, chats integration
-- Location (record users location on login and action performed)

-- uuid generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA "users";

CREATE SCHEMA "service_requests";

CREATE SCHEMA "users_profile";

CREATE SCHEMA "activity_log";

CREATE SCHEMA "scheduled_service_request";

CREATE TYPE "users"."account_type" AS ENUM (
  'admin',
  'business',
  'user'
);

CREATE TYPE "service_requests"."status" AS ENUM (
  'accepted',
  'Done',
  'Canceled',
  'Pending',
  'Booked'
);

CREATE TYPE "users_profile"."activities_subscribed" AS ENUM (
  'email',
  'chat',
  'service_requests'
);

CREATE TYPE "activity_log"."type" AS ENUM (
  'chat',
  'service_requests_accepted',
  'service_requests_declined',
  'service_request_completed',
  'service_request_scheduled'
);

CREATE TYPE "scheduled_service_request"."every" AS ENUM (
  'Day',
  'Week',
  'Month'
);

CREATE TABLE "users" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "first_name" varchar,
  "last_name" varchar,
  "phone" varchar,
  "email" varchar,
  "is_email_verified" boolean DEFAULT false,
  "is_phone_verified" boolean DEFAULT false,
  "account_type" users.account_type DEFAULT 'user',
  "avatar" text,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at"  TIMESTAMPTZ NULL
);

CREATE TABLE "users_profile" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "activities_subscribed" users_profile.activities_subscribed array NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at"  TIMESTAMPTZ NULL
);

CREATE TABLE "business" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid,
  "category_id" uuid,
  "name" varchar,
  "avater" varchar,
  "is_verified" boolean DEFAULT false,
  "tag" varchar,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ NULL
);

CREATE TABLE "business_categories" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar UNIQUE NOT NULL,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ NULL
);

CREATE TABLE "service_requests" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "business_id" uuid,
  "user_id" uuid,
  "status" service_requests.status,
  "title" varchar(1000),
  "description" text,
  "is_scheduled_request" boolean DEFAULT false,
  "scheduled_service_request_id" uuid,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at"  TIMESTAMPTZ NULL
);

CREATE TABLE "scheduled_service_request" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" varchar,
  "every" scheduled_service_request.every,
  "count" integer NOT NULL, -- // every 7 days, 2 weeks, 4 months etc
  "start_date" TIMESTAMPTZ,
  "business_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "active" boolean,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ NULL
);

CREATE TABLE "service_feedback" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "service_request_id" uuid NOT NULL,
  "rating" integer NOT NULL,
  "review" text,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ NULL
);

CREATE TABLE "activity_log" (
  "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "is_read" boolean DEFAULT false,
  "type" activity_log.type,
  "activity_id" uuid,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "deleted_at" TIMESTAMPTZ NULL
);

ALTER TABLE "users_profile" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "business" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "business" ADD FOREIGN KEY ("category_id") REFERENCES "business_categories" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("business_id") REFERENCES "business" ("uuid");

ALTER TABLE "service_feedback" ADD FOREIGN KEY ("service_request_id") REFERENCES "service_requests" ("uuid");

ALTER TABLE "activity_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("scheduled_service_request_id") REFERENCES "scheduled_service_request" ("uuid");
