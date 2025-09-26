import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import * as ERRORS from '../../../utils/constants/error_en.json';

export class CreateStudentIdDto {
  @ApiProperty({
    name: 'id',
    description: 'National Student ID',
    example: 'NS011',
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.STU01 })
  @Expose()
  id: string;

  @ApiProperty({
    name: 'full_name',
    description: 'Full name of the student',
    example: 'Pham Van Duc',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERRORS.ALEM02 })
  @Expose({ name: 'full_name' })
  fullName?: string;

  @ApiProperty({
    name: 'date_of_birth',
    description: 'Date of birth',
    example: '2001-11-08',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { context: ERRORS.ALEM02 })
  @Expose({ name: 'date_of_birth' })
  dateOfBirth?: string;

  @ApiProperty({
    name: 'university',
    description: 'University name',
    example: 'Ho Chi Minh City University of Technology',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERRORS.ALEM02 })
  @Expose()
  university?: string;

  @ApiProperty({
    name: 'major',
    description: 'Major/Field of study',
    example: 'Computer Science',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERRORS.ALEM02 })
  @Expose()
  major?: string;

  @ApiProperty({
    name: 'enrollment_year',
    description: 'Enrollment year',
    example: 2020,
    required: false,
  })
  @IsOptional()
  @IsInt({ context: ERRORS.ALEM02 })
  @Expose({ name: 'enrollment_year' })
  enrollmentYear?: number;

  @ApiProperty({
    name: 'graduation_year',
    description: 'Graduation year',
    example: 2024,
    required: false,
  })
  @IsOptional()
  @IsInt({ context: ERRORS.ALEM02 })
  @Expose({ name: 'graduation_year' })
  graduationYear?: number;
}
