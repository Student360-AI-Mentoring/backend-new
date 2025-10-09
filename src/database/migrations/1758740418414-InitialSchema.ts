import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1758740418414 implements MigrationInterface {
  name = 'InitialSchema1758740418414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types
    await queryRunner.query(`
      CREATE TYPE "job_type_enum" AS ENUM('full_time', 'part_time', 'internship', 'contract')
    `);

    await queryRunner.query(`
      CREATE TYPE "experience_level_enum" AS ENUM('internship', 'fresher', 'junior', 'middle', 'senior')
    `);

    await queryRunner.query(`
      CREATE TYPE "application_method_enum" AS ENUM('internal', 'external')
    `);

    // National Student IDs table
    await queryRunner.query(`
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
      )
    `);

    // Account Types table
    await queryRunner.query(`
      CREATE TABLE "account_types" (
        "id" int PRIMARY KEY,
        "name" varchar,
        "description" varchar
      )
    `);

    // Accounts table
    await queryRunner.query(`
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
      )
    `);

    // User Tokens table
    await queryRunner.query(`
      CREATE TABLE "user_tokens" (
        "id" SERIAL PRIMARY KEY,
        "account_id" varchar,
        "refresh_token" varchar,
        "expires_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Students table
    await queryRunner.query(`
      CREATE TABLE "students" (
        "id" SERIAL PRIMARY KEY,
        "account_id" varchar,
        "national_student_id" varchar,
        "current_year" integer,
        "gpa" decimal(3,2),
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Skills table
    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id" SERIAL PRIMARY KEY,
        "name" text,
        "category" text,
        "description" text,
        "created_by" varchar,
        "updated_by" varchar,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Companies table
    await queryRunner.query(`
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
      )
    `);

    // Locations table
    await queryRunner.query(`
      CREATE TABLE "locations" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar(100) UNIQUE
      )
    `);

    // Job industry table
    await queryRunner.query(`
      CREATE TABLE "industries" (
        "id" SERIAL PRIMARY KEY,
        "parent_id" int,
        "name" varchar(100) UNIQUE,
        "description" text
      )
    `);

    // Salary Currencies table
    await queryRunner.query(`
      CREATE TABLE "salary_currencies" (
        "code" varchar(3) PRIMARY KEY,
        "name" varchar(50),
        "symbol" varchar(5)
      )
    `);

    // Jobs table
    await queryRunner.query(`
      CREATE TABLE "jobs" (
        "id" BIGSERIAL PRIMARY KEY,
        "company_id" bigint,
        "industry_id" int,
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
      )
    `);

    // Job Skills table
    await queryRunner.query(`
      CREATE TABLE "job_skills" (
        "id" BIGSERIAL PRIMARY KEY,
        "job_id" bigint,
        "skill_id" int,
        "is_required" boolean DEFAULT false
      )
    `);

    // Applications table
    await queryRunner.query(`
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
      )
    `);

    // User Saved Jobs table
    await queryRunner.query(`
      CREATE TABLE "user_saved_jobs" (
        "id" BIGSERIAL PRIMARY KEY,
        "student_id" int,
        "job_id" bigint,
        "saved_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Tags table
    await queryRunner.query(`
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
      )
    `);

    // Tag Positions table
    await queryRunner.query(`
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
      )
    `);

    // Tag Positions Tag Search table
    await queryRunner.query(`
      CREATE TABLE "tag_positions_tag_search" (
        "id" SERIAL PRIMARY KEY,
        "tag_position_id" int,
        "tag_search_id" int,
        "sort" int,
        "created_by" varchar,
        "updated_by" varchar,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now()
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE UNIQUE INDEX ON "applications" ("job_id", "student_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX ON "user_saved_jobs" ("student_id", "job_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "tag_positions_tag_search"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tag_positions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tags"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_saved_jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "applications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "job_skills"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "salary_currencies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "industries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "locations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "industries"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "skills"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "students"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "account_types"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "national_student_ids"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "application_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "experience_level_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "job_type_enum"`);
  }
}
