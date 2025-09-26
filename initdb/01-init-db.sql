-- Create ENUM types
CREATE TYPE "job_type_enum" AS ENUM('full_time', 'part_time', 'internship', 'contract');

CREATE TYPE "experience_level_enum" AS ENUM('internship', 'fresher', 'junior', 'middle', 'senior');

CREATE TYPE "application_method_enum" AS ENUM('internal', 'external');

-- National Student IDs table
CREATE TABLE "national_student_ids" (
    "id" varchar PRIMARY KEY,
    "full_name" varchar,
    "date_of_birth" date,
    "university" varchar,
    "major" varchar,
    "enrollment_year" int,
    "graduation_year" int,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Account Types table
CREATE TABLE "account_types" (
    "id" int PRIMARY KEY,
    "name" varchar,
    "description" varchar
);

-- Accounts table
CREATE TABLE "accounts" (
    "id" varchar PRIMARY KEY,
    "national_student_id" varchar,
    "external_id" varchar,
    "account_type_id" int,
    "email" varchar UNIQUE,
    "password_hash" varchar,
    "is_active" boolean DEFAULT true,
    "is_verified" boolean DEFAULT false,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- User Tokens table
CREATE TABLE "user_tokens" (
    "id" SERIAL PRIMARY KEY,
    "account_id" varchar,
    "refresh_token" varchar,
    "expires_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Students table
CREATE TABLE "students" (
    "id" SERIAL PRIMARY KEY,
    "account_id" varchar,
    "national_student_id" varchar,
    "current_year" integer,
    "gpa" decimal(3,2),
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Skills table
CREATE TABLE "skills" (
    "id" SERIAL PRIMARY KEY,
    "name" text,
    "category" text,
    "description" text,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Industries table
CREATE TABLE "industries" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar(100) UNIQUE,
    "description" text
);

-- Companies table
CREATE TABLE "companies" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" varchar(255),
    "description" text,
    "website" varchar(255),
    "industry_id" int,
    "size" int,
    "contact_email" varchar(255),
    "logo_url" varchar(500),
    "address" varchar(255)
);

-- Locations table
CREATE TABLE "locations" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar(100) UNIQUE
);

-- Job Categories table
CREATE TABLE "job_categories" (
    "id" SERIAL PRIMARY KEY,
    "parent_id" int,
    "name" varchar(100) UNIQUE,
    "description" text
);

-- Salary Currencies table
CREATE TABLE "salary_currencies" (
    "code" varchar(3) PRIMARY KEY,
    "name" varchar(50),
    "symbol" varchar(5)
);

-- Jobs table
CREATE TABLE "jobs" (
    "id" BIGSERIAL PRIMARY KEY,
    "company_id" bigint,
    "category_id" int,
    "location_id" int,
    "title" varchar(255),
    "description" text,
    "requirements" text,
    "job_type" job_type_enum,
    "experience_level" experience_level_enum,
    "salary_min" decimal(15,0),
    "salary_max" decimal(15,0),
    "salary_currency" varchar(3),
    "application_method" application_method_enum,
    "application_url" varchar(500),
    "application_email" varchar(255),
    "apply_count" bigint DEFAULT 0,
    "deadline" TIMESTAMP,
    "is_active" boolean DEFAULT true,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Job Skills table
CREATE TABLE "job_skills" (
    "id" BIGSERIAL PRIMARY KEY,
    "job_id" bigint,
    "skill_id" int,
    "is_required" boolean DEFAULT false
);

-- Applications table
CREATE TABLE "applications" (
    "id" BIGSERIAL PRIMARY KEY,
    "job_id" bigint,
    "student_id" int,
    "status" varchar(50),
    "resume_url" varchar(500),
    "cover_url" varchar(500),
    "responses" jsonb,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- User Saved Jobs table
CREATE TABLE "user_saved_jobs" (
    "id" BIGSERIAL PRIMARY KEY,
    "student_id" int,
    "job_id" bigint,
    "saved_at" TIMESTAMP DEFAULT now()
);

-- Tags table
CREATE TABLE "tags" (
    "id" SERIAL PRIMARY KEY,
    "title" varchar,
    "tag_type" varchar(50),
    "filter_config" jsonb,
    "description" text,
    "is_active" boolean DEFAULT true,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Tag Positions table
CREATE TABLE "tag_positions" (
    "id" SERIAL PRIMARY KEY,
    "tag_id" int,
    "position" varchar,
    "sort_order" int,
    "is_shown" boolean DEFAULT true,
    "priority" int,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Tag Positions Tag Search table
CREATE TABLE "tag_positions_tag_search" (
    "id" SERIAL PRIMARY KEY,
    "tag_position_id" int,
    "tag_search_id" int,
    "sort" int,
    "created_by" varchar,
    "updated_by" varchar,
    "created_at" TIMESTAMP DEFAULT now(),
    "updated_at" TIMESTAMP DEFAULT now()
);

-- Create indexes
CREATE UNIQUE INDEX ON "applications" ("job_id", "student_id");
CREATE UNIQUE INDEX ON "user_saved_jobs" ("student_id", "job_id");


-- ================ FOREIGN KEY ================
-- Add Foreign Keys

-- Accounts table foreign keys
ALTER TABLE "accounts" 
ADD CONSTRAINT "FK_accounts_national_student_id" 
FOREIGN KEY ("national_student_id") REFERENCES "national_student_ids" ("id");

ALTER TABLE "accounts" 
ADD CONSTRAINT "FK_accounts_account_type_id" 
FOREIGN KEY ("account_type_id") REFERENCES "account_types" ("id");

-- User tokens foreign keys
ALTER TABLE "user_tokens" 
ADD CONSTRAINT "FK_user_tokens_account_id" 
FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");

-- Students table foreign keys
ALTER TABLE "students" 
ADD CONSTRAINT "FK_students_account_id" 
FOREIGN KEY ("account_id") REFERENCES "accounts" ("id");

ALTER TABLE "students" 
ADD CONSTRAINT "FK_students_national_student_id" 
FOREIGN KEY ("national_student_id") REFERENCES "national_student_ids" ("id");

-- Skills table foreign keys
ALTER TABLE "skills" 
ADD CONSTRAINT "FK_skills_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "skills" 
ADD CONSTRAINT "FK_skills_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");

-- Companies table foreign keys
ALTER TABLE "companies" 
ADD CONSTRAINT "FK_companies_industry_id" 
FOREIGN KEY ("industry_id") REFERENCES "industries" ("id");

-- Job categories table foreign keys (self-referencing)
ALTER TABLE "job_categories" 
ADD CONSTRAINT "FK_job_categories_parent_id" 
FOREIGN KEY ("parent_id") REFERENCES "job_categories" ("id");

-- Jobs table foreign keys
ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_company_id" 
FOREIGN KEY ("company_id") REFERENCES "companies" ("id");

ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_category_id" 
FOREIGN KEY ("category_id") REFERENCES "job_categories" ("id");

ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_location_id" 
FOREIGN KEY ("location_id") REFERENCES "locations" ("id");

ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_salary_currency" 
FOREIGN KEY ("salary_currency") REFERENCES "salary_currencies" ("code");

ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "jobs" 
ADD CONSTRAINT "FK_jobs_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");

-- Job skills table foreign keys
ALTER TABLE "job_skills" 
ADD CONSTRAINT "FK_job_skills_job_id" 
FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");

ALTER TABLE "job_skills" 
ADD CONSTRAINT "FK_job_skills_skill_id" 
FOREIGN KEY ("skill_id") REFERENCES "skills" ("id");

-- Applications table foreign keys
ALTER TABLE "applications" 
ADD CONSTRAINT "FK_applications_job_id" 
FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");

ALTER TABLE "applications" 
ADD CONSTRAINT "FK_applications_student_id" 
FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "applications" 
ADD CONSTRAINT "FK_applications_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "applications" 
ADD CONSTRAINT "FK_applications_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");

-- User saved jobs table foreign keys
ALTER TABLE "user_saved_jobs" 
ADD CONSTRAINT "FK_user_saved_jobs_student_id" 
FOREIGN KEY ("student_id") REFERENCES "students" ("id");

ALTER TABLE "user_saved_jobs" 
ADD CONSTRAINT "FK_user_saved_jobs_job_id" 
FOREIGN KEY ("job_id") REFERENCES "jobs" ("id");

-- Tags table foreign keys
ALTER TABLE "tags" 
ADD CONSTRAINT "FK_tags_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "tags" 
ADD CONSTRAINT "FK_tags_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");

-- Tag positions table foreign keys
ALTER TABLE "tag_positions" 
ADD CONSTRAINT "FK_tag_positions_tag_id" 
FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");

ALTER TABLE "tag_positions" 
ADD CONSTRAINT "FK_tag_positions_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "tag_positions" 
ADD CONSTRAINT "FK_tag_positions_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");

-- Tag positions tag search table foreign keys
ALTER TABLE "tag_positions_tag_search" 
ADD CONSTRAINT "FK_tag_positions_tag_search_tag_position_id" 
FOREIGN KEY ("tag_position_id") REFERENCES "tag_positions" ("id");

ALTER TABLE "tag_positions_tag_search" 
ADD CONSTRAINT "FK_tag_positions_tag_search_tag_search_id" 
FOREIGN KEY ("tag_search_id") REFERENCES "tags" ("id");

ALTER TABLE "tag_positions_tag_search" 
ADD CONSTRAINT "FK_tag_positions_tag_search_created_by" 
FOREIGN KEY ("created_by") REFERENCES "accounts" ("id");

ALTER TABLE "tag_positions_tag_search" 
ADD CONSTRAINT "FK_tag_positions_tag_search_updated_by" 
FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id");
