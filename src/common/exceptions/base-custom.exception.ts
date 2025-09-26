import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseCustomException extends HttpException {
  abstract readonly code: string;
  abstract readonly userMessage: string;

  constructor(message: string, status: HttpStatus, public readonly details?: unknown) {
    super(message, status);
  }

  getErrorResponse() {
    return {
      code: this.code,
      message: this.userMessage,
      details: this.details,
    };
  }
}
