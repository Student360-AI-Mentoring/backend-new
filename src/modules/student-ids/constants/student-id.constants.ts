import { CustomException } from '@/common/exceptions/custom.exception';
import { HttpStatus } from '@nestjs/common';

export const StudentIdExceptions = {
  StudentIdAlreadyExistsException: (message?: string, details?: unknown) =>
    new CustomException(
      'STUDENT_ID_ALREADY_EXISTS',
      message || 'Student ID already exists',
      HttpStatus.CONFLICT,
      details,
    ),

  StudentIdNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('STUDENT_ID_NOT_FOUND', message || 'Student ID not found', HttpStatus.NOT_FOUND, details),

  InvalidStudentIdFormatException: (message?: string, details?: unknown) =>
    new CustomException(
      'INVALID_STUDENT_ID_FORMAT',
      message || 'Invalid student ID format',
      HttpStatus.BAD_REQUEST,
      details,
    ),

  InvalidDateOfBirthException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_DATE_OF_BIRTH', message || 'Invalid date of birth', HttpStatus.BAD_REQUEST, details),

  InvalidEnrollmentYearException: (message?: string, details?: unknown) =>
    new CustomException(
      'INVALID_ENROLLMENT_YEAR',
      message || 'Invalid enrollment year',
      HttpStatus.BAD_REQUEST,
      details,
    ),

  InvalidGraduationYearException: (message?: string, details?: unknown) =>
    new CustomException(
      'INVALID_GRADUATION_YEAR',
      message || 'Invalid graduation year',
      HttpStatus.BAD_REQUEST,
      details,
    ),

  UniversityNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('UNIVERSITY_NOT_FOUND', message || 'University not found', HttpStatus.NOT_FOUND, details),

  MajorNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('MAJOR_NOT_FOUND', message || 'Major not found', HttpStatus.NOT_FOUND, details),
};

export interface StudentIdSuccess {
  message: string;
}

export const StudentIdSuccessMessages = {
  StudentIdCreatedSuccessfully: {
    message: 'Student ID created successfully',
  },
  StudentIdUpdatedSuccessfully: {
    message: 'Student ID updated successfully',
  },
  StudentIdDeletedSuccessfully: {
    message: 'Student ID deleted successfully',
  },
  StudentIdsRetrievedSuccessfully: {
    message: 'Student IDs retrieved successfully',
  },
  StudentIdSearchCompleted: {
    message: 'Student ID search completed successfully',
  },
} as const satisfies Record<string, StudentIdSuccess>;
