import { BusinessException } from '@/common/exceptions';

interface AuthSuccess {
  message: string;
}

// Predefined Auth Errors - Simple and Direct
export const AUTH_ERRORS = {
  USER_ALREADY_EXISTS: new BusinessException(
    'USER_ALREADY_EXISTS',
    'User with this email already exists',
    'An account with this email address is already registered in the system',
    409,
  ),
  INVALID_CREDENTIALS: new BusinessException(
    'INVALID_CREDENTIALS',
    'Invalid credentials',
    'The provided email or password is incorrect',
    401,
  ),
  ACCOUNT_INACTIVE: new BusinessException(
    'ACCOUNT_INACTIVE',
    'Account is inactive',
    'Your account has been deactivated. Please contact support',
    401,
  ),
  ACCOUNT_NOT_FOUND: new BusinessException(
    'ACCOUNT_NOT_FOUND',
    'Account not found',
    'No account found with the provided information',
    404,
  ),
  INVALID_REFRESH_TOKEN: new BusinessException(
    'INVALID_REFRESH_TOKEN',
    'Invalid refresh token',
    'The refresh token is expired or invalid. Please login again',
    401,
  ),
  NATIONAL_STUDENT_ID_NOT_FOUND: new BusinessException(
    'NATIONAL_STUDENT_ID_NOT_FOUND',
    'National Student ID not found',
    'The provided National Student ID does not exist in the system',
    404,
  ),
} as const;

export const AUTH_SUCCESS = {
  USER_REGISTERED_SUCCESSFULLY: {
    message: 'User registered successfully',
  },
  LOGIN_SUCCESS: {
    message: 'Login successful',
  },
  LOGOUT_SUCCESS: {
    message: 'Successfully logged out',
  },
  TOKENS_REFRESHED_SUCCESSFULLY: {
    message: 'Tokens refreshed successfully',
  },
} as const satisfies Record<string, AuthSuccess>;
