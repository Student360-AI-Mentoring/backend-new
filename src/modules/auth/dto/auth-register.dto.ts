import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsInt } from 'class-validator';
import { Expose } from 'class-transformer';
import { ERROR_EN } from '../../../utils/constants/error_en';

export class AuthRegisterDto {
  @ApiProperty({
    name: 'email',
    example: 'nguyen.van.duc@email.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsNotEmpty({ context: ERROR_EN.ALEM01 })
  @IsEmail({}, { context: ERROR_EN.EMAIL01 })
  @Expose()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'StrongPassword123!',
    description: 'Password of the user (minimum 8 characters)',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ context: ERROR_EN.ALEM01 })
  @IsString({ context: ERROR_EN.ALEM02 })
  @MinLength(8, { context: ERROR_EN.PASS02 })
  @Expose()
  password: string;

  @ApiProperty({
    name: 'national_student_id',
    example: 'NS001',
    description: 'National Student ID (must exist in national_student_ids table)',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERROR_EN.STU01 })
  @Expose({ name: 'national_student_id' })
  nationalStudentId?: string;

  @ApiProperty({
    name: 'external_id',
    example: 'ext_011',
    description: 'External ID for third-party integrations',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERROR_EN.ALEM02 })
  @Expose({ name: 'external_id' })
  externalId?: string;

  @ApiProperty({
    name: 'account_type_id',
    example: 1,
    description: 'Account Type ID (1=Student, 2=Company HR, 3=Company Admin, etc.)',
    required: false,
  })
  @IsOptional()
  @IsInt({ context: ERROR_EN.ACC01 })
  @Expose({ name: 'account_type_id' })
  accountTypeId?: number;
}
