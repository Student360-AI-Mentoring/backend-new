import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({
    name: 'access_token',
    description: 'Access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose({ name: 'access_token' })
  accessToken: string;

  @ApiProperty({
    name: 'refresh_token',
    description: 'Refresh token for getting new access tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  @ApiProperty({
    name: 'expires_in',
    description: 'Access token expiry time in seconds',
    example: 3600,
  })
  @Expose({ name: 'expires_in' })
  expiresIn: number;

  constructor(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
