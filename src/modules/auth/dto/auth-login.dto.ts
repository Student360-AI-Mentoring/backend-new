import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import * as ERRORS from '../../../utils/constants/error_en.json';

export class AuthLoginDto {
  @ApiProperty({
    name: 'email',
    example: 'nguyen.van.duc@email.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsEmail({}, { context: ERRORS.EMAIL01 })
  @Expose()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'StrongPassword123!',
    description: 'Password of the user (minimum 8 characters)',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.ALEM02 })
  @MinLength(8, { context: ERRORS.PASS02 })
  @Expose()
  password: string;
}
