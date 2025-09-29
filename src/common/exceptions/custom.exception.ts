import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationDetail } from './types/validation.type';

export class CustomException extends HttpException {
  code: string;
  message: string;
  details?: unknown;

  constructor(code: string, message: string, status: HttpStatus, details?: unknown) {
    super(message, status);
    this.code = code;
    this.message = message;
    this.details = details;
  }

  getErrorResponse() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export const CommonExceptions = {
  InternalException: (message?: string, details?: unknown) =>
    new CustomException(
      'INTERNAL_SERVER_ERROR',
      message || 'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
    ),

  ValidationException: (message?: string, details?: ValidationDetail[]) =>
    new CustomException('VALIDATION_ERROR', message || 'Validation failed', HttpStatus.BAD_REQUEST, details),

  UserAlreadyExistsException: (message?: string, details?: unknown) =>
    new CustomException('USER_ALREADY_EXISTS', message || 'User already exists', HttpStatus.BAD_REQUEST, details),

  UserNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('USER_NOT_FOUND', message || 'User not found', HttpStatus.NOT_FOUND, details),

  InvalidCredentialsException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_CREDENTIALS', message || 'Invalid credentials', HttpStatus.UNAUTHORIZED, details),
};
