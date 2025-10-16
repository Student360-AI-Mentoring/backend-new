import { registerAs } from '@nestjs/config';
import { ThrottlerConfig } from './throttler-config.type';
import { IsInt, Min, Max } from 'class-validator';
import validateConfig from '@/utils/validations/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(1)
  @Max(3600)
  THROTTLE_TTL: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  THROTTLE_LIMIT: number;
}

export default registerAs<ThrottlerConfig>('throttler', () => {
  const envValues: Record<string, unknown> = {
    ...process.env,
    THROTTLE_TTL: process.env.THROTTLE_TTL ?? '60',
    THROTTLE_LIMIT: process.env.THROTTLE_LIMIT ?? '10',
  };

  validateConfig(envValues, EnvironmentVariablesValidator);

  return {
    ttl: parseInt(envValues.THROTTLE_TTL as string, 10), // Time to live in seconds (default: 60s)
    limit: parseInt(envValues.THROTTLE_LIMIT as string, 10), // Max requests per TTL (default: 10)
  };
});
