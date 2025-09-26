import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Account } from '../domain/account';
import { JwtRefreshPayload } from './types/jwt-refresh-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.refreshJwt.secret'),
    });
  }

  async validate(payload: JwtRefreshPayload): Promise<Account> {
    const account = await this.authService.findAccountById(payload.sub);

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    if (!account.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify refresh token exists and is valid
    const isValidToken = await this.authService.validateRefreshToken(payload.tokenId, payload.sub);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return account;
  }
}
