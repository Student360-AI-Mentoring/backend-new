import { CustomException } from '@/common/exceptions/custom.exception';
import { HttpStatus } from '@nestjs/common';

export const AuthExceptions = {
  UserAlreadyExistsException: (message?: string, details?: unknown) =>
    new CustomException(
      'USER_ALREADY_EXISTS',
      message || 'User with this email already exists',
      HttpStatus.CONFLICT,
      details,
    ),

  InvalidCredentialsException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_CREDENTIALS', message || 'Invalid credentials', HttpStatus.UNAUTHORIZED, details),

  AccountInactiveException: (message?: string, details?: unknown) =>
    new CustomException('ACCOUNT_INACTIVE', message || 'Account is inactive', HttpStatus.UNAUTHORIZED, details),

  AccountNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('ACCOUNT_NOT_FOUND', message || 'Account not found', HttpStatus.NOT_FOUND, details),

  InvalidRefreshTokenException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_REFRESH_TOKEN', message || 'Invalid refresh token', HttpStatus.UNAUTHORIZED, details),

  NationalStudentIdNotFoundException: (message?: string, details?: unknown) =>
    new CustomException(
      'NATIONAL_STUDENT_ID_NOT_FOUND',
      message || 'National Student ID not found',
      HttpStatus.NOT_FOUND,
      details,
    ),
};

export interface AuthSuccess {
  message: string;
}

export const AuthSuccessMessages = {
  UserRegisteredSuccessfully: {
    message: 'User registered successfully',
  },
  LoginSuccess: {
    message: 'Login successful',
  },
  LogoutSuccess: {
    message: 'Successfully logged out',
  },
  TokensRefreshedSuccessfully: {
    message: 'Tokens refreshed successfully',
  },
} as const satisfies Record<string, AuthSuccess>;
