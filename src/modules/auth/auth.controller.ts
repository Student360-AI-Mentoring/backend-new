import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Account } from './domain/account';
import { AUTH_SUCCESS } from './constants/auth.constants';
import { AuthDoc } from './constants/auth-doc.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @AuthDoc.RegisterSummary()
  @AuthDoc.RegisterSuccess()
  @AuthDoc.RegisterBadRequest()
  @AuthDoc.RegisterConflict()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthRegisterDto): Promise<UserResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @AuthDoc.SignInSummary()
  @AuthDoc.SignInSuccess()
  @AuthDoc.SignInBadRequest()
  @AuthDoc.SignInUnauthorized()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: AUTH_SUCCESS.TOKENS_REFRESHED_SUCCESSFULLY.message,
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: AuthRefreshDto): Promise<LoginResponseDto> {
    return await this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({
    status: 200,
    description: AUTH_SUCCESS.LOGOUT_SUCCESS.message,
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: { user: Account }): Promise<{ message: string }> {
    await this.authService.logout(req.user.id);
    return { message: AUTH_SUCCESS.LOGOUT_SUCCESS.message };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  getProfile(@Request() req: { user: Account }): UserResponseDto {
    return Object.assign(new UserResponseDto(), req.user);
  }
}
