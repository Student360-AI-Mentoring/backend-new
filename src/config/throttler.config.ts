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
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10), // Time to live in seconds (default: 60s)
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // Max requests per TTL (default: 10)
  };
});
