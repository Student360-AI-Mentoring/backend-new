import { ApiResponse, IPagination } from '@/type';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request & { requestId?: string }>();

    const requestId = request?.requestId ?? (request?.headers['x-request-id'] as string | undefined) ?? null;

    if (!request?.requestId) {
      if (request) {
        request.requestId = typeof requestId === 'string' ? requestId : undefined;
      }
    }

    const existingHeader = response.getHeader('X-Request-Id');
    if (!existingHeader) {
      response.setHeader('X-Request-Id', requestId);
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const payload: ApiResponse<T> = {
          success: true,
          status: response.statusCode,
          meta: {
            timestamp: new Date(),
            request_id: requestId,
          },
        };

        if (data !== undefined) {
          if (data && typeof data === 'object' && 'data' in (data as Record<string, unknown>)) {
            const d = data as Record<string, unknown>;
            payload.data = d.data as T;
            if ('pagination' in d) {
              payload.pagination = d.pagination as IPagination;
            }
          } else {
            payload.data = data as T;
          }
        }

        return payload;
      }),
    );
  }
}
