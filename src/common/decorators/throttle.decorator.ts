import { Throttle as NestThrottle } from '@nestjs/throttler';

/**
 * Custom Throttle decorator for rate limiting
 * @param options - Configuration for rate limiting
 * @param options.ttl - Time to live in seconds (default from config)
 * @param options.limit - Maximum number of requests within TTL (default from config)
 * 
 * @example
 * // Allow 5 requests per 60 seconds
 * @Throttle({ ttl: 60, limit: 5 })
 * 
 * @example
 * // Allow 100 requests per 300 seconds (5 minutes)
 * @Throttle({ ttl: 300, limit: 100 })
 */
export const Throttle = (options: { ttl: number; limit: number }) => {
  return NestThrottle({ default: { ttl: options.ttl * 1000, limit: options.limit } });
};
