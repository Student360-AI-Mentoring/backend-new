import { HttpStatus } from '@nestjs/common';
import { BaseCustomException } from './base-custom.exception';

export interface ValidationDetail {
  field: string;
  code: string;
  message: string;
  details: string;
}

export class ValidationException extends BaseCustomException {
  readonly code = 'VALIDATION_ERROR';
  readonly userMessage = 'Validation failed';

  constructor(public readonly details: ValidationDetail[]) {
    super('Validation failed', HttpStatus.BAD_REQUEST, details);
  }
}
