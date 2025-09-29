import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { StudentIdResponseDto } from '../dto/student-id-response.dto';

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

const PAGINATION_SCHEMA: Schema = {
  type: 'object',
  properties: {
    page: { type: 'number', example: 1 },
    limit: { type: 'number', example: 10 },
    total: { type: 'number', example: 100 },
  },
};

const VALIDATION_DETAIL_SCHEMA: Schema = {
  type: 'object',
  properties: {
    field: { type: 'string', example: 'full_name' },
    code: { type: 'string', example: 'ALEM01' },
    message: { type: 'string', example: 'full_name is required' },
    details: { type: 'string', example: 'Please provide full_name' },
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

export const StudentIdDoc = {
  CreateSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create student ID',
        description: 'Persist a new student ID record with personal and academic information.',
      }),
    ),

  CreateSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Student ID created successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.CREATED, {
          $ref: getSchemaPath(StudentIdResponseDto),
        }),
      }),
    ),

  CreateBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Input payload failed validation.',
        schema: buildValidationErrorSchema(HttpStatus.BAD_REQUEST),
      }),
    ),

  CreateConflict: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Student ID already exists.',
        schema: buildErrorResponseSchema(HttpStatus.CONFLICT, {
          code: { type: 'string', example: 'STUDENT_ID_ALREADY_EXISTS' },
          message: { type: 'string', example: 'Student ID already exists' },
          details: {
            type: 'string',
            example: 'A student with this ID is already registered in the system',
          },
        }),
      }),
    ),

  GetAllSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List student IDs',
        description: 'Fetch a paginated list of student ID records.',
      }),
    ),

  GetAllSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student IDs retrieved successfully.',
        schema: buildSuccessResponseSchema(
          HttpStatus.OK,
          {
            type: 'array',
            items: { $ref: getSchemaPath(StudentIdResponseDto) },
          },
          { pagination: PAGINATION_SCHEMA },
        ),
      }),
    ),

  GetOneSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get student ID',
        description: 'Retrieve a single student ID by its identifier.',
      }),
    ),

  GetOneSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student ID retrieved successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          $ref: getSchemaPath(StudentIdResponseDto),
        }),
      }),
    ),

  GetOneNotFound: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Student ID not found.',
        schema: buildErrorResponseSchema(HttpStatus.NOT_FOUND, {
          code: { type: 'string', example: 'STUDENT_ID_NOT_FOUND' },
          message: { type: 'string', example: 'Student ID not found' },
          details: {
            type: 'string',
            example: 'No student found with the provided ID',
          },
        }),
      }),
    ),

  UpdateSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update student ID',
        description: 'Modify an existing student ID record.',
      }),
    ),

  UpdateSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student ID updated successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          $ref: getSchemaPath(StudentIdResponseDto),
        }),
      }),
    ),

  DeleteSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete student ID',
        description: 'Remove a student ID record from the system.',
      }),
    ),

  DeleteSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Student ID deleted successfully.',
        schema: buildSuccessResponseSchema(HttpStatus.NO_CONTENT),
      }),
    ),

  SearchSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Search student IDs',
        description: 'Search student IDs using a free-text query.',
      }),
    ),

  SearchSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student IDs matching the query.',
        schema: buildSuccessResponseSchema(HttpStatus.OK, {
          type: 'array',
          items: { $ref: getSchemaPath(StudentIdResponseDto) },
        }),
      }),
    ),
};
