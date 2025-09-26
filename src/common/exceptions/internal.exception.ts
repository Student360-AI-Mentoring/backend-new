import { HttpStatus } from '@nestjs/common';
import { BaseCustomException } from './base-custom.exception';

export class InternalException extends BaseCustomException {
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly userMessage = 'An unexpected error occurred';

  constructor(message?: string, details?: unknown) {
    super(message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
