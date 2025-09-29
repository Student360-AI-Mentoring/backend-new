import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class BusinessException extends CustomException {
  constructor(
    public readonly code: string,
    public readonly message: string,
    details?: unknown,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, status, details);
  }
}

// Specific business exceptions
export class UserAlreadyExistsException extends BusinessException {
  constructor() {
    super('USER_ALREADY_EXISTS', 'User already exists');
  }
}

export class UserNotFoundException extends BusinessException {
  constructor() {
    super('USER_NOT_FOUND', 'User not found', undefined, HttpStatus.NOT_FOUND);
  }
}

export class InvalidCredentialsException extends BusinessException {
  constructor() {
    super('INVALID_CREDENTIALS', 'Invalid credentials', undefined, HttpStatus.UNAUTHORIZED);
  }
}
