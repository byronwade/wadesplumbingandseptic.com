
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "testing";

ALTER SCHEMA "testing" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "address_standardizer" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_jsonschema" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."authors" (
    "id" integer NOT NULL,
    "username" character varying(255) NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text"
);

ALTER TABLE "public"."authors" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."authors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."authors_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."authors_id_seq" OWNED BY "public"."authors"."id";

CREATE TABLE IF NOT EXISTS "public"."images" (
    "id" integer NOT NULL,
    "alttext" "text",
    "sizes" "text",
    "sourceurl" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."images" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."featured_images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."featured_images_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."featured_images_id_seq" OWNED BY "public"."images"."id";

CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" bigint NOT NULL,
    "title" "text",
    "content" "text",
    "excerpt" "text",
    "created_at" "text",
    "job_type" "text",
    "benefits" "text",
    "location" "text",
    "pay_range" "text",
    "qualifications" "text",
    "shift_and_schedule" "text",
    "categories" "text",
    "tags" "text",
    "slug" "text",
    "seo" integer
);

ALTER TABLE "public"."jobs" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."menu_items" (
    "item_id" integer NOT NULL,
    "menu_id" integer NOT NULL,
    "parent_item_id" integer,
    "title" "text" NOT NULL,
    "url" "text",
    "page_id" integer,
    "post_id" integer,
    "custom_link" "text",
    "target" "text",
    "classes" "text",
    "menu_order" integer,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."menu_items" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."menu_items_item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."menu_items_item_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."menu_items_item_id_seq" OWNED BY "public"."menu_items"."item_id";

CREATE TABLE IF NOT EXISTS "public"."menus" (
    "menu_id" integer NOT NULL,
    "name" "text" NOT NULL,
    "location" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);

ALTER TABLE "public"."menus" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."menus_menu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."menus_menu_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."menus_menu_id_seq" OWNED BY "public"."menus"."menu_id";

CREATE TABLE IF NOT EXISTS "public"."newsletter" (
    "id" integer NOT NULL,
    "email" character varying(255) NOT NULL,
    "first_name" character varying(50),
    "last_name" character varying(50),
    "subscribed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "is_subscribed" boolean DEFAULT true
);

ALTER TABLE "public"."newsletter" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."newsletter_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."newsletter_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."newsletter_id_seq" OWNED BY "public"."newsletter"."id";

CREATE TABLE IF NOT EXISTS "public"."pages" (
    "page_id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "author_id" integer NOT NULL,
    "featured_image_id" integer,
    "seo_id" integer,
    "template" character varying(255),
    "parent_page_id" integer,
    "menu_order" integer,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."pages" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."pages_page_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."pages_page_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."pages_page_id_seq" OWNED BY "public"."pages"."page_id";

CREATE TABLE IF NOT EXISTS "public"."tips" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "excerpt" "text",
    "slug" "text" NOT NULL,
    "readingtime" numeric NOT NULL,
    "author_id" integer,
    "featured_image_id" integer,
    "content" "text",
    "categories" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "featured" boolean DEFAULT false,
    "seo" integer
);

ALTER TABLE "public"."tips" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."posts_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."posts_id_seq" OWNED BY "public"."tips"."id";

CREATE TABLE IF NOT EXISTS "public"."promotions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "content" "text",
    "expiration" "date",
    "seo" integer
);

ALTER TABLE "public"."promotions" OWNER TO "postgres";

ALTER TABLE "public"."promotions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."promotions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."seo" (
    "id" integer NOT NULL,
    "page_url" character varying(255) NOT NULL,
    "title_tag" character varying(255),
    "meta_description" character varying(512),
    "canonical_url" character varying(255),
    "header_tags" "text",
    "alt_text" "text",
    "internal_links" "text",
    "external_links" "text",
    "keyword" character varying(255),
    "keyword_frequency" integer,
    "page_rank" integer,
    "backlinks" integer,
    "domain_authority" integer,
    "page_authority" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."seo" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."seo_seo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."seo_seo_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."seo_seo_id_seq" OWNED BY "public"."seo"."id";

CREATE TABLE IF NOT EXISTS "public"."services" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "slug" character varying(255) NOT NULL,
    "excerpt" "text",
    "readingtime" numeric NOT NULL,
    "featured_image" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "content" "text",
    "categories" "text"[],
    "author_id" integer,
    "featured" boolean DEFAULT false,
    "seo" integer
);

ALTER TABLE "public"."services" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."services_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."services_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."services_id_seq" OWNED BY "public"."services"."id";

CREATE TABLE IF NOT EXISTS "public"."website" (
    "site_id" integer NOT NULL,
    "site_title" character varying(255) NOT NULL,
    "site_description" "text",
    "site_url" character varying(255) NOT NULL,
    "admin_email" character varying(255) NOT NULL,
    "default_seo_id" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."website" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."website_site_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."website_site_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."website_site_id_seq" OWNED BY "public"."website"."site_id";

ALTER TABLE ONLY "public"."authors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."authors_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."images" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."featured_images_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."menu_items" ALTER COLUMN "item_id" SET DEFAULT "nextval"('"public"."menu_items_item_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."newsletter" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."newsletter_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."pages" ALTER COLUMN "page_id" SET DEFAULT "nextval"('"public"."pages_page_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."seo" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."seo_seo_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."services" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."services_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."tips" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."posts_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."website" ALTER COLUMN "site_id" SET DEFAULT "nextval"('"public"."website_site_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."images"
    ADD CONSTRAINT "featured_images_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_pkey" PRIMARY KEY ("item_id");

ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_menu_id_key" UNIQUE ("menu_id");

ALTER TABLE ONLY "public"."menus"
    ADD CONSTRAINT "menus_pkey" PRIMARY KEY ("menu_id");

ALTER TABLE ONLY "public"."newsletter"
    ADD CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("page_id");

ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."tips"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."seo"
    ADD CONSTRAINT "seo_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."website"
    ADD CONSTRAINT "website_pkey" PRIMARY KEY ("site_id");

ALTER TABLE ONLY "public"."website"
    ADD CONSTRAINT "website_site_url_key" UNIQUE ("site_url");

CREATE OR REPLACE TRIGGER "update_menu_items_updated_at" BEFORE UPDATE ON "public"."menu_items" FOR EACH ROW WHEN (("new".* IS DISTINCT FROM "old".*)) EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_menus_updated_at" BEFORE UPDATE ON "public"."menus" FOR EACH ROW WHEN (("new".* IS DISTINCT FROM "old".*)) EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_pages_updated_at" BEFORE UPDATE ON "public"."pages" FOR EACH ROW WHEN (("new".* IS DISTINCT FROM "old".*)) EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_website_updated_at" BEFORE UPDATE ON "public"."website" FOR EACH ROW WHEN (("new".* IS DISTINCT FROM "old".*)) EXECUTE FUNCTION "public"."update_updated_at_column"();

ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_seo_fkey" FOREIGN KEY ("seo") REFERENCES "public"."seo"("id");

ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("menu_id");

ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("page_id");

ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_parent_item_id_fkey" FOREIGN KEY ("parent_item_id") REFERENCES "public"."menu_items"("item_id");

ALTER TABLE ONLY "public"."menu_items"
    ADD CONSTRAINT "menu_items_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."tips"("id");

ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id");

ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "public"."images"("id");

ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_seo_id_fkey" FOREIGN KEY ("seo_id") REFERENCES "public"."seo"("id");

ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_seo_fkey" FOREIGN KEY ("seo") REFERENCES "public"."seo"("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_featured_image_fkey" FOREIGN KEY ("featured_image") REFERENCES "public"."images"("id");

ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_seo_fkey" FOREIGN KEY ("seo") REFERENCES "public"."seo"("id");

ALTER TABLE ONLY "public"."tips"
    ADD CONSTRAINT "tips_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id");

ALTER TABLE ONLY "public"."tips"
    ADD CONSTRAINT "tips_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "public"."images"("id");

ALTER TABLE ONLY "public"."tips"
    ADD CONSTRAINT "tips_seo_fkey" FOREIGN KEY ("seo") REFERENCES "public"."seo"("id");

ALTER TABLE ONLY "public"."website"
    ADD CONSTRAINT "website_default_seo_id_fkey" FOREIGN KEY ("default_seo_id") REFERENCES "public"."seo"("id");

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT ALL ON TABLE "public"."authors" TO "anon";
GRANT ALL ON TABLE "public"."authors" TO "authenticated";
GRANT ALL ON TABLE "public"."authors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."images" TO "anon";
GRANT ALL ON TABLE "public"."images" TO "authenticated";
GRANT ALL ON TABLE "public"."images" TO "service_role";

GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."featured_images_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";

GRANT ALL ON TABLE "public"."menu_items" TO "anon";
GRANT ALL ON TABLE "public"."menu_items" TO "authenticated";
GRANT ALL ON TABLE "public"."menu_items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."menu_items_item_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."menu_items_item_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."menu_items_item_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."menus" TO "anon";
GRANT ALL ON TABLE "public"."menus" TO "authenticated";
GRANT ALL ON TABLE "public"."menus" TO "service_role";

GRANT ALL ON SEQUENCE "public"."menus_menu_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."menus_menu_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."menus_menu_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."newsletter" TO "anon";
GRANT ALL ON TABLE "public"."newsletter" TO "authenticated";
GRANT ALL ON TABLE "public"."newsletter" TO "service_role";

GRANT ALL ON SEQUENCE "public"."newsletter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."newsletter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."newsletter_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";

GRANT ALL ON SEQUENCE "public"."pages_page_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pages_page_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pages_page_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tips" TO "anon";
GRANT ALL ON TABLE "public"."tips" TO "authenticated";
GRANT ALL ON TABLE "public"."tips" TO "service_role";

GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."posts_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."promotions" TO "anon";
GRANT ALL ON TABLE "public"."promotions" TO "authenticated";
GRANT ALL ON TABLE "public"."promotions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."promotions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."promotions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."promotions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."seo" TO "anon";
GRANT ALL ON TABLE "public"."seo" TO "authenticated";
GRANT ALL ON TABLE "public"."seo" TO "service_role";

GRANT ALL ON SEQUENCE "public"."seo_seo_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seo_seo_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seo_seo_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";

GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."website" TO "anon";
GRANT ALL ON TABLE "public"."website" TO "authenticated";
GRANT ALL ON TABLE "public"."website" TO "service_role";

GRANT ALL ON SEQUENCE "public"."website_site_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."website_site_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."website_site_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
