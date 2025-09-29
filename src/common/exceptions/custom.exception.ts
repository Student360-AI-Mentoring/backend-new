import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class CustomException extends HttpException {
  abstract readonly code: string;
  abstract readonly message: string;

  constructor(message: string, status: HttpStatus, public readonly details?: unknown) {
    super(message, status);
  }

  getErrorResponse() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
