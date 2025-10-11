import { AppConfig } from './app-config.type';
import { TDatabaseConfig } from '@/database/config/database-config.type';
import { ThrottlerConfig } from './throttler-config.type';

/**
 * Aggregated config type. Extend this whenever you register
 * additional configuration namespaces (mail, auth, etc.).
 */
export type AllConfigType = {
  app: AppConfig;
  database: TDatabaseConfig;
  throttler: ThrottlerConfig;
};
