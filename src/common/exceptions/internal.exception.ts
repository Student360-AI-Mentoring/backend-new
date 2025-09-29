import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class InternalException extends CustomException {
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly message = 'An unexpected error occurred';

  constructor(message?: string, details?: unknown) {
    super(message || 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
