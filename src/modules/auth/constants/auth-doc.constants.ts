import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

const ISO_DATE_EXAMPLE = '2025-01-01T00:00:00.000Z';
const REQUEST_ID_EXAMPLE = 'req-1234567890';

type Schema = Record<string, unknown>;

const META_SCHEMA: Schema = {
  type: 'object',
  properties: {
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: ISO_DATE_EXAMPLE,
    },
    request_id: {
      type: 'string',
      example: REQUEST_ID_EXAMPLE,
    },
  },
};

const VALIDATION_DETAIL_SCHEMA: Schema = {
  type: 'object',
  properties: {
    field: { type: 'string', example: 'email' },
    code: { type: 'string', example: 'EMAIL01' },
    message: {
      type: 'string',
      example: 'Email must be a valid email address',
    },
    details: {
      type: 'string',
      example: 'Please provide a valid email address',
    },
  },
};

const VALIDATION_DETAILS_ARRAY_SCHEMA: Schema = {
  type: 'array',
  items: VALIDATION_DETAIL_SCHEMA,
};

const buildSuccessResponseSchema = (status: number, dataSchema?: Schema, extras?: Record<string, Schema>): Schema => {
  const schema: Schema = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      status: { type: 'number', example: status },
      meta: META_SCHEMA,
    },
  };

  if (dataSchema) {
    (schema.properties as Record<string, Schema>).data = dataSchema;
  }

  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      (schema.properties as Record<string, Schema>)[key] = value;
    }
  }

  return schema;
};

const buildErrorResponseSchema = (status: number, errorProperties: Schema): Schema => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    status: { type: 'number', example: status },
    error: {
      type: 'object',
      properties: errorProperties,
    },
    meta: META_SCHEMA,
  },
});

const buildValidationErrorSchema = (status: number, detailsSchema: Schema = VALIDATION_DETAILS_ARRAY_SCHEMA): Schema =>
  buildErrorResponseSchema(status, {
    code: { type: 'string', example: 'VALIDATION_ERROR' },
    message: { type: 'string', example: 'Validation failed' },
    details: detailsSchema,
  });

export const AuthDoc = {
  RegisterSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Register user',
        description: 'Create a new user account using email, password, and optional student metadata.',
      }),
    ),

  RegisterSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Account created successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.CREATED, {
          $ref: getSchemaPath(UserResponseDto),
        }),
      }),
    ),

  RegisterBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Input payload failed validation.',
        schema: buildValidationErrorSchema(HttpStatus.BAD_REQUEST),
      }),
    ),

  RegisterConflict: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email already registered.',
        schema: buildErrorResponseSchema(HttpStatus.CONFLICT, {
          code: { type: 'string', example: 'USER_ALREADY_EXISTS' },
          message: {
            type: 'string',
            example: 'User with this email already exists',
          },
          details: {
            type: 'string',
            example: 'An account with this email address already exists.',
          },
        }),
      }),
    ),

  SignInSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Authenticate user',
        description: 'Verify credentials and issue access and refresh tokens.',
      }),
    ),

  SignInSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Credentials accepted, tokens issued.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          $ref: getSchemaPath(LoginResponseDto),
        }),
      }),
    ),

  SignInBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Login payload failed validation.',
        schema: buildValidationErrorSchema(HttpStatus.BAD_REQUEST),
      }),
    ),

  SignInUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials or inactive account.',
        schema: buildErrorResponseSchema(HttpStatus.UNAUTHORIZED, {
          code: { type: 'string', example: 'INVALID_CREDENTIALS' },
          message: { type: 'string', example: 'Invalid credentials' },
        }),
      }),
    ),

  RefreshSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Refresh access token',
        description: 'Exchange a refresh token for a new access token pair.',
      }),
    ),

  RefreshSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Tokens refreshed successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          $ref: getSchemaPath(LoginResponseDto),
        }),
      }),
    ),

  RefreshBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Refresh token payload failed validation.',
        schema: buildValidationErrorSchema(HttpStatus.BAD_REQUEST, {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'refresh_token' },
              code: { type: 'string', example: 'ALEM01' },
              message: { type: 'string', example: 'Refresh token is required' },
              details: {
                type: 'string',
                example: 'refresh_token must be a non-empty string',
              },
            },
          },
        }),
      }),
    ),

  RefreshUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Refresh token is invalid or expired.',
        schema: buildErrorResponseSchema(HttpStatus.UNAUTHORIZED, {
          code: { type: 'string', example: 'INVALID_REFRESH_TOKEN' },
          message: { type: 'string', example: 'Invalid refresh token' },
        }),
      }),
    ),

  LogoutSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Logout current user',
        description: 'Invalidate all refresh tokens belonging to the authenticated account.',
      }),
    ),

  LogoutSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Refresh tokens revoked successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Successfully logged out',
            },
          },
        }),
      }),
    ),

  LogoutUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Missing or invalid bearer token.',
        schema: buildErrorResponseSchema(HttpStatus.UNAUTHORIZED, {
          code: { type: 'string', example: 'UNAUTHORIZED' },
          message: { type: 'string', example: 'Unauthorized' },
        }),
      }),
    ),

  ProfileSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get current user profile',
        description: 'Return the authenticated user profile derived from the access token.',
      }),
    ),

  ProfileSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Authenticated user profile.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          $ref: getSchemaPath(UserResponseDto),
        }),
      }),
    ),

  ProfileUnauthorized: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Missing or invalid bearer token.',
        schema: buildErrorResponseSchema(HttpStatus.UNAUTHORIZED, {
          code: { type: 'string', example: 'UNAUTHORIZED' },
          message: { type: 'string', example: 'Unauthorized' },
        }),
      }),
    ),
};
