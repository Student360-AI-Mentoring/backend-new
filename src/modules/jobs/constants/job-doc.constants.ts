import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { JobListItemResponseDto } from '../dto/job-list-item-response.dto';

type Schema = Record<string, unknown>;

const ISO_DATE_EXAMPLE = '2024-09-25T12:18:47.893Z';
const REQUEST_ID_EXAMPLE = 'req-1234567890';

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
    total: { type: 'number', example: 50 },
  },
};

const VALIDATION_DETAIL_SCHEMA: Schema = {
  type: 'object',
  properties: {
    field: { type: 'string', example: 'page' },
    code: { type: 'string', example: 'ALEM01' },
    message: { type: 'string', example: 'page must be greater than or equal to 1' },
    details: { type: 'string', example: 'page must be an integer value >= 1' },
  },
};

const VALIDATION_DETAILS_ARRAY_SCHEMA: Schema = {
  type: 'array',
  items: VALIDATION_DETAIL_SCHEMA,
};

const buildSuccessResponseSchema = (status: number, dataSchema: Schema, extras?: Record<string, Schema>): Schema => {
  const schema: Schema = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      status: { type: 'number', example: status },
      data: dataSchema,
      meta: META_SCHEMA,
    },
  };

  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      (schema.properties as Record<string, Schema>)[key] = value;
    }
  }

  return schema;
};

const buildValidationErrorSchema = (
  status: number,
  detailsSchema: Schema = VALIDATION_DETAILS_ARRAY_SCHEMA,
): Schema => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    status: { type: 'number', example: status },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: 'VALIDATION_ERROR' },
        message: { type: 'string', example: 'Validation failed' },
        details: detailsSchema,
      },
    },
    meta: META_SCHEMA,
  },
});

export const JobDoc = {
  GetAllSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List jobs',
        description: 'Fetch a paginated list of job postings with optional filters.',
      }),
    ),

  GetAllSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Jobs retrieved successfully.',
        schema: buildSuccessResponseSchema(
          HttpStatus.OK,
          {
            type: 'array',
            items: { $ref: getSchemaPath(JobListItemResponseDto) },
          },
          { pagination: PAGINATION_SCHEMA },
        ),
      }),
    ),

  GetAllBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Input query failed validation.',
        schema: buildValidationErrorSchema(HttpStatus.BAD_REQUEST),
      }),
    ),
};
