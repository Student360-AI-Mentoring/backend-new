import dataSource from '@/database/data-source';
import { seeds } from './seeds';

async function runSeeds(): Promise<void> {
  const dataSourceInstance = dataSource.isInitialized ? dataSource : await dataSource.initialize();

  const queryRunner = dataSourceInstance.createQueryRunner();

  try {
    await queryRunner.startTransaction();

    for (const seed of seeds) {
      // eslint-disable-next-line no-console
      console.info(`→ Running seed: ${seed.name}`);
      await seed.run(queryRunner);
    }

    await queryRunner.commitTransaction();
    // eslint-disable-next-line no-console
    console.info('✓ Dummy data seeded successfully.');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    // eslint-disable-next-line no-console
    console.error('✗ Seeding failed. Rolling back changes...');
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  } finally {
    await queryRunner.release();

    if (dataSourceInstance.isInitialized) {
      await dataSourceInstance.destroy();
    }
  }
}

runSeeds().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected error while running seeds:', error);
  process.exit(1);
});
