import { ApiResponse, IMeta, IPagination } from '@/type';
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

    const isApiResponse = (value: unknown): value is ApiResponse<T> => {
      if (!value || typeof value !== 'object') {
        return false;
      }

      const v = value as Record<string, unknown>;
      return 'success' in v && 'status' in v && 'meta' in v;
    };

    return next.handle().pipe(
      map((data: unknown) => {
        if (isApiResponse(data)) {
          const original = data;
          const metaSrc = original.meta ?? {};
          const metaRecord = metaSrc as Record<string, unknown>;

          const metaRequestId =
            (typeof metaRecord.request_id === 'string' ? metaRecord.request_id : undefined) ??
            (typeof metaRecord.requestId === 'string' ? metaRecord.requestId : undefined) ??
            (typeof requestId === 'string' ? requestId : null);

          // remove camelCase requestId if present
          if ('requestId' in metaRecord) {
            delete metaRecord.requestId;
          }

          const timestamp =
            metaRecord.timestamp instanceof Date
              ? metaRecord.timestamp
              : metaRecord.timestamp
              ? new Date(String(metaRecord.timestamp))
              : new Date();

          return {
            ...original,
            meta: {
              ...(metaRecord as unknown as IMeta),
              request_id: metaRequestId,
              timestamp,
            },
          };
        }

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
