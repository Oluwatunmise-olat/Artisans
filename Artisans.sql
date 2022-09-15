-- TODO:
-- FK constraints
-- Implement adavance business users account for better discoverability, chats integration
-- Location (record users location on login and action performed)

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
  "uuid" string PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "phone" varchar,
  "email" varchar,
  "email_verified" boolean DEFAULT false,
  "phone_verified" boolean DEFAULT false,
  "account_type" users.account_type DEFAULT 'user',
  "avatar" text,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "users_profile" (
  "uuid" string PRIMARY KEY,
  "user_id" int NOT NULL,
  "activities_subscribed" users_profile.activities_subscribed array NOT NULL,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "business" (
  "uuid" string PRIMARY KEY,
  "user_id" string,
  "category_id" string,
  "name" varchar,
  "avater" varchar,
  "verified" boolean DEFAULT false,
  "tag" varchar,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "business_categories" (
  "uuid" string PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "service_requests" (
  "uuid" string PRIMARY KEY,
  "business_id" string,
  "user_id" string,
  "status" service_requests.status,
  "title" varchar(1000),
  "description" text,
  "is_scheduled_request" boolean DEFAULT false,
  "scheduled_service_request_id" int,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "scheduled_service_request" (
  "uuid" string PRIMARY KEY,
  "title" string,
  "every" scheduled_service_request.every,
  "count" int, -- // every 7 days, 2 weeks, 4 months etc
  "start_date" timestamp,
  "business_id" int NOT NULL,
  "user_id" int NOT NULL,
  "active" boolean,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "service_feedback" (
  "uuid" string PRIMARY KEY,
  "service_request_id" string NOT NULL,
  "rating" integer NOT NULL,
  "review" text,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

CREATE TABLE "activity_log" (
  "uuid" string PRIMARY KEY,
  "user_id" integer,
  "is_read" boolean DEFAULT false,
  "type" activity_log.type,
  "activity_id" int,
  "created_at" "timestamp default CURRENT_TIMESTAMP" NOT NULL,
  "updated_at" "timestamp default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" NOT NULL,
  "deleted_at" "timestamp default NULL"
);

ALTER TABLE "users" ADD FOREIGN KEY ("uuid") REFERENCES "users_profile" ("user_id");

ALTER TABLE "users" ADD FOREIGN KEY ("uuid") REFERENCES "business" ("user_id");

ALTER TABLE "business" ADD FOREIGN KEY ("category_id") REFERENCES "business_categories" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("business_id") REFERENCES "business" ("uuid");

ALTER TABLE "service_feedback" ADD FOREIGN KEY ("service_request_id") REFERENCES "service_requests" ("uuid");

ALTER TABLE "activity_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("uuid");

ALTER TABLE "service_requests" ADD FOREIGN KEY ("scheduled_service_request_id") REFERENCES "scheduled_service_request" ("uuid");
