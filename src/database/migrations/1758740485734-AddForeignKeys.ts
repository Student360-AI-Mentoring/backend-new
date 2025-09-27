import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeys1758740485734 implements MigrationInterface {
  name = 'AddForeignKeys1758740485734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add Foreign Keys
    await queryRunner.query(`
      ALTER TABLE "accounts" 
      ADD CONSTRAINT "FK_accounts_national_student_id" 
      FOREIGN KEY ("national_student_id") REFERENCES "national_student_ids" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "accounts" 
      ADD CONSTRAINT "FK_accounts_account_type_id" 
      FOREIGN KEY ("account_type_id") REFERENCES "account_types" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "user_tokens" 
      ADD CONSTRAINT "FK_user_tokens_account_id" 
      FOREIGN KEY ("account_id") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "students" 
      ADD CONSTRAINT "FK_students_account_id" 
      FOREIGN KEY ("account_id") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "students" 
      ADD CONSTRAINT "FK_students_national_student_id" 
      FOREIGN KEY ("national_student_id") REFERENCES "national_student_ids" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "skills" 
      ADD CONSTRAINT "FK_skills_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "skills" 
      ADD CONSTRAINT "FK_skills_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "companies" 
      ADD CONSTRAINT "FK_companies_industry_id" 
      FOREIGN KEY ("industry_id") REFERENCES "industries" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "job_categories" 
      ADD CONSTRAINT "FK_job_categories_parent_id" 
      FOREIGN KEY ("parent_id") REFERENCES "job_categories" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_company_id" 
      FOREIGN KEY ("company_id") REFERENCES "companies" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_category_id" 
      FOREIGN KEY ("category_id") REFERENCES "job_categories" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_location_id" 
      FOREIGN KEY ("location_id") REFERENCES "locations" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_salary_currency" 
      FOREIGN KEY ("salary_currency") REFERENCES "salary_currencies" ("code")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "jobs" 
      ADD CONSTRAINT "FK_jobs_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "job_skills" 
      ADD CONSTRAINT "FK_job_skills_job_id" 
      FOREIGN KEY ("job_id") REFERENCES "jobs" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "job_skills" 
      ADD CONSTRAINT "FK_job_skills_skill_id" 
      FOREIGN KEY ("skill_id") REFERENCES "skills" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "applications" 
      ADD CONSTRAINT "FK_applications_job_id" 
      FOREIGN KEY ("job_id") REFERENCES "jobs" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "applications" 
      ADD CONSTRAINT "FK_applications_student_id" 
      FOREIGN KEY ("student_id") REFERENCES "students" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "applications" 
      ADD CONSTRAINT "FK_applications_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "applications" 
      ADD CONSTRAINT "FK_applications_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "user_saved_jobs" 
      ADD CONSTRAINT "FK_user_saved_jobs_student_id" 
      FOREIGN KEY ("student_id") REFERENCES "students" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "user_saved_jobs" 
      ADD CONSTRAINT "FK_user_saved_jobs_job_id" 
      FOREIGN KEY ("job_id") REFERENCES "jobs" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tags" 
      ADD CONSTRAINT "FK_tags_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tags" 
      ADD CONSTRAINT "FK_tags_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions" 
      ADD CONSTRAINT "FK_tag_positions_tag_id" 
      FOREIGN KEY ("tag_id") REFERENCES "tags" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions" 
      ADD CONSTRAINT "FK_tag_positions_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions" 
      ADD CONSTRAINT "FK_tag_positions_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions_tag_search" 
      ADD CONSTRAINT "FK_tag_positions_tag_search_tag_position_id" 
      FOREIGN KEY ("tag_position_id") REFERENCES "tag_positions" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions_tag_search" 
      ADD CONSTRAINT "FK_tag_positions_tag_search_tag_search_id" 
      FOREIGN KEY ("tag_search_id") REFERENCES "tags" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions_tag_search" 
      ADD CONSTRAINT "FK_tag_positions_tag_search_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "accounts" ("id")
    `);

    await queryRunner.query(`
      ALTER TABLE "tag_positions_tag_search" 
      ADD CONSTRAINT "FK_tag_positions_tag_search_updated_by" 
      FOREIGN KEY ("updated_by") REFERENCES "accounts" ("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all foreign keys (PostgreSQL will handle cascading)
    await queryRunner.query(
      `ALTER TABLE "tag_positions_tag_search" DROP CONSTRAINT IF EXISTS "FK_tag_positions_tag_search_updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_positions_tag_search" DROP CONSTRAINT IF EXISTS "FK_tag_positions_tag_search_created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_positions_tag_search" DROP CONSTRAINT IF EXISTS "FK_tag_positions_tag_search_tag_search_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_positions_tag_search" DROP CONSTRAINT IF EXISTS "FK_tag_positions_tag_search_tag_position_id"`,
    );
    await queryRunner.query(`ALTER TABLE "tag_positions" DROP CONSTRAINT IF EXISTS "FK_tag_positions_updated_by"`);
    await queryRunner.query(`ALTER TABLE "tag_positions" DROP CONSTRAINT IF EXISTS "FK_tag_positions_created_by"`);
    await queryRunner.query(`ALTER TABLE "tag_positions" DROP CONSTRAINT IF EXISTS "FK_tag_positions_tag_id"`);
    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT IF EXISTS "FK_tags_updated_by"`);
    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT IF EXISTS "FK_tags_created_by"`);
    await queryRunner.query(`ALTER TABLE "user_saved_jobs" DROP CONSTRAINT IF EXISTS "FK_user_saved_jobs_job_id"`);
    await queryRunner.query(`ALTER TABLE "user_saved_jobs" DROP CONSTRAINT IF EXISTS "FK_user_saved_jobs_student_id"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_updated_by"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_created_by"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_student_id"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_job_id"`);
    await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT IF EXISTS "FK_job_skills_skill_id"`);
    await queryRunner.query(`ALTER TABLE "job_skills" DROP CONSTRAINT IF EXISTS "FK_job_skills_job_id"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_updated_by"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_created_by"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_salary_currency"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_location_id"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_category_id"`);
    await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT IF EXISTS "FK_jobs_company_id"`);
    await queryRunner.query(`ALTER TABLE "job_categories" DROP CONSTRAINT IF EXISTS "FK_job_categories_parent_id"`);
    await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT IF EXISTS "FK_companies_industry_id"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT IF EXISTS "FK_skills_updated_by"`);
    await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT IF EXISTS "FK_skills_created_by"`);
    await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT IF EXISTS "FK_students_national_student_id"`);
    await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT IF EXISTS "FK_students_account_id"`);
    await queryRunner.query(`ALTER TABLE "user_tokens" DROP CONSTRAINT IF EXISTS "FK_user_tokens_account_id"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "FK_accounts_account_type_id"`);
    await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "FK_accounts_national_student_id"`);
  }
}
