CREATE TABLE IF NOT EXISTS "action" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"isDemo" boolean NOT NULL,
	"createdUtc" date,
	"imageUrl" varchar(2048),
	"description" varchar(8192),
	"worldId" integer NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"imageUrl" varchar(2048),
	"description" varchar(8192),
	"userId" integer NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(256) NOT NULL,
	"eventData" json NOT NULL,
	"createdUtc" date NOT NULL,
	"campaignId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monster" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monsterToActions" (
	"userId" integer NOT NULL,
	"actionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "status" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL,
	"worldId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdUtc" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "world" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(8192),
	"isTemplate" boolean NOT NULL,
	"userId" integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_name_idx" ON "user" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "action" ADD CONSTRAINT "action_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign" ADD CONSTRAINT "campaign_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign" ADD CONSTRAINT "campaign_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "character" ADD CONSTRAINT "character_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "classes" ADD CONSTRAINT "classes_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monster" ADD CONSTRAINT "monster_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monsterToActions" ADD CONSTRAINT "monsterToActions_userId_monster_id_fk" FOREIGN KEY ("userId") REFERENCES "monster"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monsterToActions" ADD CONSTRAINT "monsterToActions_actionId_action_id_fk" FOREIGN KEY ("actionId") REFERENCES "action"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "status" ADD CONSTRAINT "status_worldId_world_id_fk" FOREIGN KEY ("worldId") REFERENCES "world"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "world" ADD CONSTRAINT "world_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
