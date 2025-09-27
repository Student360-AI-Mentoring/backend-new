import { promises as fs } from 'fs';
import { join } from 'path';
import { QueryRunner } from 'typeorm';

export interface Seed {
  name: string;
  run(queryRunner: QueryRunner): Promise<void>;
}

async function loadSqlStatements(filePath: string): Promise<string[]> {
  const fileContent = await fs.readFile(filePath, 'utf8');

  const strippedComments = fileContent
    .split('\n')
    .map((line) => (line.trim().startsWith('--') ? '' : line))
    .join('\n');

  return strippedComments
    .split(/;\s*(?:\r?\n|$)/g)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function executeSqlFile(queryRunner: QueryRunner, fileRelativePath: string): Promise<void> {
  const filePath = join(__dirname, '../../../', fileRelativePath);
  const statements = await loadSqlStatements(filePath);

  for (const statement of statements) {
    await queryRunner.query(statement);
  }
}

export const dummyDataSeed: Seed = {
  name: 'dummy-data',
  async run(queryRunner: QueryRunner) {
    await executeSqlFile(queryRunner, 'initdb/01-career-seed-data.sql');
  },
};

export const seeds: Seed[] = [dummyDataSeed];
