import { ApiResponse, IError, IMeta } from '@/type';

export class ErrorResponseHelper {
  static createErrorResponse(status: number, error: IError, requestId: string): ApiResponse {
    return {
      success: false,
      status,
      error,
      meta: this.createMeta(requestId),
    };
  }

  static createMeta(requestId: string): IMeta {
    return {
      timestamp: new Date(),
      request_id: requestId,
    };
  }
}
