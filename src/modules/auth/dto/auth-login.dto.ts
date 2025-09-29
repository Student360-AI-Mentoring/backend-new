import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ERROR_EN } from '../../../utils/constants/error_en';

export class AuthLoginDto {
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
}
