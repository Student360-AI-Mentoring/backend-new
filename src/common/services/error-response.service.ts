import { Injectable } from '@nestjs/common';
import { ApiResponse, IError, IMeta } from '@/type';

@Injectable()
export class ErrorResponseService {
  createErrorResponse(status: number, error: IError, requestId: string): ApiResponse {
    return {
      success: false,
      status,
      error,
      meta: this.createMeta(requestId),
    };
  }

  private createMeta(requestId: string): IMeta {
    return {
      timestamp: new Date(),
      request_id: requestId,
    };
  }
}
