import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ERROR_EN } from '../../../utils/constants/error_en';

export class AuthRefreshDto {
  @ApiProperty({
    name: 'refresh_token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token for getting new access tokens',
    required: true,
  })
  @IsNotEmpty({ context: ERROR_EN.ALEM01 })
  @IsString({ context: ERROR_EN.ALEM02 })
  @Expose({ name: 'refresh_token' })
  refreshToken: string;
}
