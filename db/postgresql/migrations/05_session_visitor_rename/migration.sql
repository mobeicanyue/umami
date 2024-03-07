-- RenameIndex visitor
ALTER INDEX "session_pkey" RENAME TO "visitor_pkey";
ALTER INDEX "session_session_id_key" RENAME TO "visitor_visitor_id_key";
ALTER INDEX "session_created_at_idx" RENAME TO "visitor_created_at_idx";
ALTER INDEX "session_website_id_idx" RENAME TO "visitor_website_id_idx";
ALTER INDEX "session_website_id_created_at_idx" RENAME TO "visitor_website_id_created_at_idx";
ALTER INDEX "session_website_id_created_at_hostname_idx" RENAME TO "visitor_website_id_created_at_hostname_idx";
ALTER INDEX "session_website_id_created_at_browser_idx" RENAME TO "visitor_website_id_created_at_browser_idx";
ALTER INDEX "session_website_id_created_at_os_idx" RENAME TO "visitor_website_id_created_at_os_idx";
ALTER INDEX "session_website_id_created_at_device_idx" RENAME TO "visitor_website_id_created_at_device_idx";
ALTER INDEX "session_website_id_created_at_screen_idx" RENAME TO "visitor_website_id_created_at_screen_idx";
ALTER INDEX "session_website_id_created_at_language_idx" RENAME TO "visitor_website_id_created_at_language_idx";
ALTER INDEX "session_website_id_created_at_country_idx" RENAME TO "visitor_website_id_created_at_country_idx";
ALTER INDEX "session_website_id_created_at_subdivision1_idx" RENAME TO "visitor_website_id_created_at_subdivision1_idx";
ALTER INDEX "session_website_id_created_at_city_idx" RENAME TO "visitor_website_id_created_at_city_idx";
5999
-- RenameIndex visitor_data
ALTER INDEX "session_data_pkey" RENAME TO "visitor_data_pkey";
ALTER INDEX "session_data_created_at_idx" RENAME TO "visitor_data_created_at_idx";
ALTER INDEX "session_data_website_id_idx" RENAME TO "visitor_data_website_id_idx";
ALTER INDEX "session_data_session_id_idx" RENAME TO "visitor_data_session_id_idx";

-- RenameIndex website_event
ALTER INDEX "website_event_session_id_idx" RENAME TO "website_event_visitor_id_idx";
ALTER INDEX "website_event_website_id_session_id_created_at_idx" RENAME TO "website_event_website_id_visitor_id_created_at_idx";

-- RenameColumn
ALTER TABLE "session" RENAME COLUMN "session_id" TO "visitor_id";

ALTER TABLE "session_data" RENAME COLUMN "session_data_id" TO "visitor_data_id";
ALTER TABLE "session_data" RENAME COLUMN "session_id" TO "visitor_id";
ALTER TABLE "session_data" RENAME COLUMN "session_key" TO "visitor_key";

ALTER TABLE "website_event" RENAME COLUMN "session_id" TO "visitor_id";
ALTER TABLE "website_event" ADD COLUMN "session_id" UUID NULL;

-- RenameTable
ALTER TABLE "session" RENAME TO "visitor";
ALTER TABLE "session_data" RENAME TO "visitor_data";

-- CreateIndex
CREATE INDEX "website_event_website_id_session_id_created_at_idx" ON "website_event"("website_id", "session_id", "created_at");
