import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { Throttle } from '@/common/decorators/throttle.decorator';
import { AuthDoc } from './constants/auth-doc.constants';
import { AuthSuccessMessages } from './constants/auth.constants';
import { AuthService } from './auth.service';
import { Account } from './domain/account';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Authentication')
@ApiExtraModels(UserResponseDto, LoginResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ ttl: 300, limit: 3 }) // 3 registrations per 5 minutes
  @AuthDoc.RegisterSummary()
  @AuthDoc.RegisterSuccess()
  @AuthDoc.RegisterBadRequest()
  @AuthDoc.RegisterConflict()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: AuthRegisterDto): Promise<UserResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @Throttle({ ttl: 60, limit: 5 }) // 5 login attempts per minute
  @AuthDoc.SignInSummary()
  @AuthDoc.SignInSuccess()
  @AuthDoc.SignInBadRequest()
  @AuthDoc.SignInUnauthorized()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @Throttle({ ttl: 60, limit: 10 }) // 10 refresh attempts per minute
  @AuthDoc.RefreshSummary()
  @AuthDoc.RefreshSuccess()
  @AuthDoc.RefreshBadRequest()
  @AuthDoc.RefreshUnauthorized()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: AuthRefreshDto): Promise<LoginResponseDto> {
    return await this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @AuthDoc.LogoutSummary()
  @AuthDoc.LogoutSuccess()
  @AuthDoc.LogoutUnauthorized()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: AuthSuccessMessages.LogoutSuccess.message };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @AuthDoc.ProfileSummary()
  @AuthDoc.ProfileSuccess()
  @AuthDoc.ProfileUnauthorized()
  getProfile(@CurrentUser() user: Account): UserResponseDto {
    return Object.assign(new UserResponseDto(), user);
  }
}
