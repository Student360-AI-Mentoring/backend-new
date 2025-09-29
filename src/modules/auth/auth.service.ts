import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Account } from './domain/account';
import { JwtRefreshPayload } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayload } from './strategies/types/jwt-payload.type';
import { AuthExceptions } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: AuthRegisterDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingAccount = await this.accountRepository.findByEmail(registerDto.email);
    if (existingAccount) {
      throw AuthExceptions.UserAlreadyExistsException();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Generate account ID
    const accountId = uuidv4();

    // Create account
    await this.accountRepository.create({
      id: accountId,
      email: registerDto.email,
      passwordHash: hashedPassword,
      nationalStudentId: registerDto.nationalStudentId,
      externalId: registerDto.externalId,
      accountTypeId: registerDto.accountTypeId || 1, // Default to student
    });

    // Get created account
    const account = await this.accountRepository.findById(accountId);
    return this.toUserResponseDto(account);
  }

  async login(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    // Find account by email
    const account = await this.accountRepository.findByEmail(loginDto.email);
    if (!account) {
      throw AuthExceptions.InvalidCredentialsException();
    }

    // Check if account is active
    if (!account.isActive) {
      throw AuthExceptions.AccountInactiveException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, account.passwordHash);
    if (!isPasswordValid) {
      throw AuthExceptions.InvalidCredentialsException();
    }

    // Generate tokens
    return await this.generateTokens(account);
  }

  async refresh(refreshToken: string): Promise<LoginResponseDto> {
    try {
      // Verify refresh token
      const verified = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('auth.refreshJwt.secret'),
      }) as unknown;

      if (
        !verified ||
        typeof verified !== 'object' ||
        !('sub' in (verified as Record<string, unknown>)) ||
        !('tokenId' in (verified as Record<string, unknown>))
      ) {
        throw AuthExceptions.InvalidRefreshTokenException();
      }

      const payload = verified as JwtRefreshPayload;

      // Find account
      const account = await this.accountRepository.findById(payload.sub);
      if (!account || !account.isActive) {
        throw AuthExceptions.InvalidRefreshTokenException();
      }

      // Validate refresh token in database
      const isValidToken = await this.validateRefreshToken(payload.tokenId, payload.sub);
      if (!isValidToken) {
        throw AuthExceptions.InvalidRefreshTokenException();
      }

      // Generate new tokens
      return await this.generateTokens(account);
    } catch (error) {
      throw AuthExceptions.InvalidRefreshTokenException();
    }
  }

  async logout(accountId: string): Promise<void> {
    // Remove all refresh tokens for the account
    await this.userTokenRepository.deleteByAccountId(accountId);
  }

  async findAccountById(id: string): Promise<Account | null> {
    return await this.accountRepository.findById(id);
  }

  async validateRefreshToken(tokenId: string, accountId: string): Promise<boolean> {
    const tokens = await this.userTokenRepository.findByAccountId(accountId);
    return tokens.some((token) => token.id.toString() === tokenId && !token.isExpired());
  }

  private async generateTokens(account: Account): Promise<LoginResponseDto> {
    // Create refresh token record
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7 days

    const { id: tokenId } = await this.userTokenRepository.create({
      accountId: account.id,
      refreshToken: 'temp', // Will be updated with actual token
      expiresAt: refreshTokenExpiresAt,
    });

    // Generate JWT tokens
    const jwtPayload: JwtPayload = {
      sub: account.id,
      email: account.email,
      accountTypeId: account.accountTypeId,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: account.id,
      email: account.email,
      tokenId: tokenId.toString(),
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get<string>('auth.jwt.secret'),
      expiresIn: this.configService.get<string>('auth.jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('auth.refreshJwt.secret'),
      expiresIn: this.configService.get<string>('auth.refreshJwt.expiresIn'),
    });

    // Update refresh token in database
    await this.userTokenRepository.update(tokenId, {
      refreshToken,
    });

    // Get expiry time in seconds
    const expiresIn = this.parseTimeToSeconds(this.configService.get<string>('auth.jwt.expiresIn', '1h'));

    return new LoginResponseDto(accessToken, refreshToken, expiresIn);
  }

  private parseTimeToSeconds(timeStr: string): number {
    const match = timeStr.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 3600;
    } // Default 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }

  private toUserResponseDto(account: Account): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = account.id;
    dto.email = account.email;
    dto.nationalStudentId = account.nationalStudentId;
    dto.externalId = account.externalId;
    dto.accountTypeId = account.accountTypeId;
    dto.isActive = account.isActive;
    dto.isVerified = account.isVerified;
    dto.createdAt = account.createdAt;
    dto.updatedAt = account.updatedAt;
    return dto;
  }
}
