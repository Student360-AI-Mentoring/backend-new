import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request | undefined>();
    const method = request?.method ?? 'UNKNOWN';
    const url = request?.url ?? 'UNKNOWN';
    const body = (request?.body as unknown) ?? undefined;
    const now = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url} - ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response | undefined>();
        const statusCode = response?.statusCode ?? 'UNKNOWN';
        const responseTime = Date.now() - now;

        this.logger.log(`Outgoing Response: ${method} ${url} - ${statusCode} - ${responseTime}ms`);
      }),
    );
  }
}
