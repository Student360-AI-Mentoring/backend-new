import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException, InternalException } from '../exceptions';
import { ErrorResponseService } from '../services/error-response.service';

/**
 * Global exception filter that catches all exceptions and formats them
 * according to the standardized API response format.
 *
 * Flow:
 * 1. Controller/Service throws custom exceptions (ValidationException, BusinessException, etc.)
 * 2. This filter catches all exceptions
 * 3. Converts them to standardized ApiResponse format
 * 4. Returns proper HTTP response
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly errorResponseService = new ErrorResponseService();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract or generate request ID
    const requestId = this.extractRequestId(request, response);

    // Determine status and error response based on exception type
    const { status, errorResponse } = this.buildErrorResponse(exception, requestId);

    // Log the error
    this.logError(request, status, errorResponse.error, exception);

    // Send response
    response.status(status).json(errorResponse);
  }

  private extractRequestId(request: Request, response: Response): string {
    const requestRecord = request as unknown as Record<string, unknown> & {
      requestId?: string;
    };
    const requestId =
      requestRecord.requestId ??
      (request.headers['x-request-id'] as string | undefined) ??
      (response.getHeader('X-Request-Id') as string | undefined);

    if (!requestRecord.requestId) {
      requestRecord.requestId = requestId;
    }

    if (!response.getHeader('X-Request-Id')) {
      response.setHeader('X-Request-Id', requestId);
    }

    return requestId;
  }

  private buildErrorResponse(exception: unknown, requestId: string) {
    // Handle custom exceptions (ValidationException, BusinessException, etc.)
    if (exception instanceof CustomException) {
      return {
        status: exception.getStatus(),
        errorResponse: this.errorResponseService.createErrorResponse(
          exception.getStatus(),
          exception.getErrorResponse(),
          requestId,
        ),
      };
    }

    // Handle standard NestJS HttpExceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return {
        status,
        errorResponse: this.errorResponseService.createErrorResponse(
          status,
          {
            code: HttpStatus[status] || 'HTTP_ERROR',
            message: exception.message || HttpStatus[status] || 'Error',
          },
          requestId,
        ),
      };
    }

    // Handle unexpected errors
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const internalError = new InternalException(exception instanceof Error ? exception.message : 'Unexpected error');

    return {
      status,
      errorResponse: this.errorResponseService.createErrorResponse(status, internalError.getErrorResponse(), requestId),
    };
  }

  private logError(request: Request, status: number, error: unknown, exception: unknown) {
    const logMessage = `${request.method} ${request.url} - ${status} - ${JSON.stringify(error)}`;

    if (status >= 500) {
      // Server errors - log with stack trace
      this.logger.error(logMessage, exception instanceof Error ? exception.stack : undefined);
    } else {
      // Client errors - log as warning
      this.logger.warn(logMessage);
    }
  }
}
