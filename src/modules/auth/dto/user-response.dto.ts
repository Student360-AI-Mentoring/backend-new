import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: 'acc_001',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Email address',
    example: 'nguyen.van.duc@email.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    name: 'national_student_id',
    description: 'National Student ID (references national_student_ids table)',
    example: 'NS001',
    required: false,
  })
  @Expose({ name: 'national_student_id' })
  nationalStudentId?: string;

  @ApiProperty({
    name: 'external_id',
    description: 'External ID for third-party integrations',
    example: 'ext_001',
    required: false,
  })
  @Expose({ name: 'external_id' })
  externalId?: string;

  @ApiProperty({
    name: 'account_type_id',
    description: 'Account type (1=Student, 2=Company HR, 3=Company Admin, etc.)',
    example: 1,
  })
  @Expose({ name: 'account_type_id' })
  accountTypeId: number;

  @ApiProperty({
    name: 'is_active',
    description: 'Whether the account is active',
    example: true,
  })
  @Expose({ name: 'is_active' })
  isActive: boolean;

  @ApiProperty({
    name: 'is_verified',
    description: 'Whether the email is verified',
    example: true,
  })
  @Expose({ name: 'is_verified' })
  isVerified: boolean;

  @ApiProperty({
    name: 'created_at',
    description: 'Account creation timestamp',
    example: '2025-09-25T12:18:47.893Z',
  })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    description: 'Last update timestamp',
    example: '2025-09-25T12:18:47.893Z',
  })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
