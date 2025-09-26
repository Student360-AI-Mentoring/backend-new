import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// Student ID Module Documentation Decorators
export const StudentIdDoc = {
  // Create Student ID Endpoint
  CreateSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create Student ID',
        description: 'Create a new student ID record with personal and academic information',
      }),
    ),

  CreateSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Student ID created successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            status: { type: 'number', example: HttpStatus.CREATED },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'SV2024001' },
                fullName: { type: 'string', example: 'Nguyen Van A' },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '2000-01-15',
                },
                university: {
                  type: 'string',
                  example: 'Dai hoc Bach Khoa Ha Noi',
                },
                major: { type: 'string', example: 'Computer Science' },
                enrollmentYear: { type: 'number', example: 2020 },
                graduationYear: { type: 'number', example: 2024 },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  CreateBadRequest: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation failed',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'number', example: HttpStatus.BAD_REQUEST },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Validation failed' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string', example: 'id' },
                      code: { type: 'string', example: 'STU01' },
                      message: {
                        type: 'string',
                        example: 'Invalid Student ID',
                      },
                      details: {
                        type: 'string',
                        example: 'Student ID must be a valid format',
                      },
                    },
                  },
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  CreateConflict: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Student ID already exists',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'number', example: HttpStatus.CONFLICT },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'STUDENT_ID_ALREADY_EXISTS' },
                message: {
                  type: 'string',
                  example: 'Student ID already exists',
                },
                details: {
                  type: 'string',
                  example: 'A student with this ID is already registered in the system',
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  // Get All Student IDs Endpoint
  GetAllSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get All Student IDs',
        description: 'Retrieve all student ID records from the system',
      }),
    ),

  GetAllSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student IDs retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            status: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'SV2024001' },
                  fullName: { type: 'string', example: 'Nguyen Van A' },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '2000-01-15',
                  },
                  university: {
                    type: 'string',
                    example: 'Dai hoc Bach Khoa Ha Noi',
                  },
                  major: { type: 'string', example: 'Computer Science' },
                  enrollmentYear: { type: 'number', example: 2020 },
                  graduationYear: { type: 'number', example: 2024 },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                total: { type: 'number', example: 125 },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  // Get Single Student ID Endpoint
  GetOneSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get Student ID by ID',
        description: 'Retrieve a specific student ID record by its ID',
      }),
    ),

  GetOneSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student ID retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            status: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'SV2024001' },
                fullName: { type: 'string', example: 'Nguyen Van A' },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '2000-01-15',
                },
                university: {
                  type: 'string',
                  example: 'Dai hoc Bach Khoa Ha Noi',
                },
                major: { type: 'string', example: 'Computer Science' },
                enrollmentYear: { type: 'number', example: 2020 },
                graduationYear: { type: 'number', example: 2024 },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  GetOneNotFound: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Student ID not found',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            status: { type: 'number', example: HttpStatus.NOT_FOUND },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'STUDENT_ID_NOT_FOUND' },
                message: { type: 'string', example: 'Student ID not found' },
                details: {
                  type: 'string',
                  example: 'No student found with the provided ID',
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  // Update Student ID Endpoint
  UpdateSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update Student ID',
        description: 'Update an existing student ID record with new information',
      }),
    ),

  UpdateSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Student ID updated successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            status: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'SV2024001' },
                fullName: { type: 'string', example: 'Nguyen Van A Updated' },
                dateOfBirth: {
                  type: 'string',
                  format: 'date',
                  example: '2000-01-15',
                },
                university: {
                  type: 'string',
                  example: 'Dai hoc Bach Khoa Ha Noi',
                },
                major: { type: 'string', example: 'Computer Science' },
                enrollmentYear: { type: 'number', example: 2020 },
                graduationYear: { type: 'number', example: 2024 },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),

  // Delete Student ID Endpoint
  DeleteSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete Student ID',
        description: 'Delete a student ID record from the system',
      }),
    ),

  DeleteSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Student ID deleted successfully',
      }),
    ),

  // Search Student IDs Endpoint
  SearchSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Search Student IDs',
        description: 'Search for student IDs using a query string',
      }),
    ),

  SearchSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Search completed successfully',
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            status: { type: 'number', example: HttpStatus.OK },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'SV2024001' },
                  fullName: { type: 'string', example: 'Nguyen Van A' },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '2000-01-15',
                  },
                  university: {
                    type: 'string',
                    example: 'Dai hoc Bach Khoa Ha Noi',
                  },
                  major: { type: 'string', example: 'Computer Science' },
                  enrollmentYear: { type: 'number', example: 2020 },
                  graduationYear: { type: 'number', example: 2024 },
                },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-01-01T00:00:00.000Z',
                },
                request_id: { type: 'string', example: 'req-123456' },
              },
            },
          },
        },
      }),
    ),
};
