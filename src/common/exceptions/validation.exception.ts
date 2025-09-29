import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export interface ValidationDetail {
  field: string;
  code: string;
  message: string;
  details: string;
}

export class ValidationException extends CustomException {
  readonly code = 'VALIDATION_ERROR';
  readonly message = 'Validation failed';

  constructor(public readonly details: ValidationDetail[]) {
    super('Validation failed', HttpStatus.BAD_REQUEST, details);
  }
}
