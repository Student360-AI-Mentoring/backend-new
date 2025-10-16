import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignJobsSchema1758745000000 implements MigrationInterface {
  name = 'AlignJobsSchema1758745000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Companies timestamps
    await queryRunner.query(`
      ALTER TABLE "companies"
      ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "companies"
      ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);

    // Job categories timestamps
    await queryRunner.query(`
      ALTER TABLE "job_categories"
      ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
    await queryRunner.query(`
      ALTER TABLE "job_categories"
      ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);

    // Jobs adjustments
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP CONSTRAINT IF EXISTS "FK_jobs_salary_currency"
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "location" varchar(255)
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "employment_type" varchar(50)
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "employment_type" = "job_type"::text
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "job_type"
    `);
    await queryRunner.query(`DROP TYPE IF EXISTS "job_type_enum"`);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "experience_level_tmp" varchar(50)
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "experience_level_tmp" = "experience_level"::text
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "experience_level"
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      RENAME COLUMN "experience_level_tmp" TO "experience_level"
    `);
    await queryRunner.query(`DROP TYPE IF EXISTS "experience_level_enum"`);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "application_method_tmp" varchar(50)
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "application_method_tmp" = "application_method"::text
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "application_method"
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      RENAME COLUMN "application_method_tmp" TO "application_method"
    `);
    await queryRunner.query(`DROP TYPE IF EXISTS "application_method_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "application_method_enum" AS ENUM('internal', 'external')
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "application_method_tmp" application_method_enum
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "application_method_tmp" = CASE
        WHEN "application_method" IN ('internal', 'external') THEN "application_method"::application_method_enum
        ELSE 'internal'::application_method_enum
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "application_method"
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      RENAME COLUMN "application_method_tmp" TO "application_method"
    `);

    await queryRunner.query(`
      CREATE TYPE "experience_level_enum" AS ENUM('internship', 'fresher', 'junior', 'middle', 'senior')
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "experience_level_tmp" experience_level_enum
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "experience_level_tmp" = CASE
        WHEN "experience_level" IN ('internship', 'fresher', 'junior', 'middle', 'senior') THEN "experience_level"::experience_level_enum
        ELSE 'junior'::experience_level_enum
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "experience_level"
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      RENAME COLUMN "experience_level_tmp" TO "experience_level"
    `);

    await queryRunner.query(`
      CREATE TYPE "job_type_enum" AS ENUM('full_time', 'part_time', 'internship', 'contract')
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD COLUMN "job_type" job_type_enum
    `);
    await queryRunner.query(`
      UPDATE "jobs"
      SET "job_type" = CASE
        WHEN "employment_type" IN ('full_time', 'part_time', 'internship', 'contract') THEN "employment_type"::job_type_enum
        ELSE 'full_time'::job_type_enum
      END
    `);
    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "employment_type"
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      DROP COLUMN "location"
    `);

    await queryRunner.query(`
      ALTER TABLE "job_categories"
      DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "job_categories"
      DROP COLUMN "created_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "companies"
      DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "companies"
      DROP COLUMN "created_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs"
      ADD CONSTRAINT "FK_jobs_salary_currency"
      FOREIGN KEY ("salary_currency") REFERENCES "salary_currencies" ("code")
    `);
  }
}
