import { BusinessException } from '@/common/exceptions';

interface StudentIdSuccess {
  message: string;
}

// Predefined Student ID Errors - Simple and Direct
export const STUDENT_ID_ERRORS = {
  STUDENT_ID_ALREADY_EXISTS: new BusinessException(
    'STUDENT_ID_ALREADY_EXISTS',
    'Student ID already exists',
    'A student with this ID is already registered in the system',
    409,
  ),
  STUDENT_ID_NOT_FOUND: new BusinessException(
    'STUDENT_ID_NOT_FOUND',
    'Student ID not found',
    'No student found with the provided ID',
    404,
  ),
  INVALID_STUDENT_ID_FORMAT: new BusinessException(
    'INVALID_STUDENT_ID_FORMAT',
    'Invalid student ID format',
    'Student ID must follow the correct format',
    400,
  ),
  INVALID_DATE_OF_BIRTH: new BusinessException(
    'INVALID_DATE_OF_BIRTH',
    'Invalid date of birth',
    'Date of birth must be a valid date in the past',
    400,
  ),
  INVALID_ENROLLMENT_YEAR: new BusinessException(
    'INVALID_ENROLLMENT_YEAR',
    'Invalid enrollment year',
    'Enrollment year must be a valid year',
    400,
  ),
  INVALID_GRADUATION_YEAR: new BusinessException(
    'INVALID_GRADUATION_YEAR',
    'Invalid graduation year',
    'Graduation year must be after enrollment year',
    400,
  ),
  UNIVERSITY_NOT_FOUND: new BusinessException(
    'UNIVERSITY_NOT_FOUND',
    'University not found',
    'The specified university does not exist in the system',
    404,
  ),
  MAJOR_NOT_FOUND: new BusinessException(
    'MAJOR_NOT_FOUND',
    'Major not found',
    'The specified major does not exist in the system',
    404,
  ),
} as const;

export const STUDENT_ID_SUCCESS = {
  STUDENT_ID_CREATED_SUCCESSFULLY: {
    message: 'Student ID created successfully',
  },
  STUDENT_ID_UPDATED_SUCCESSFULLY: {
    message: 'Student ID updated successfully',
  },
  STUDENT_ID_DELETED_SUCCESSFULLY: {
    message: 'Student ID deleted successfully',
  },
  STUDENT_IDS_RETRIEVED_SUCCESSFULLY: {
    message: 'Student IDs retrieved successfully',
  },
  STUDENT_ID_SEARCH_COMPLETED: {
    message: 'Student ID search completed successfully',
  },
} as const satisfies Record<string, StudentIdSuccess>;
