import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// Entities
import { AccountEntity, AccountTypeEntity, UserTokenEntity } from '../../database/entities';

// Repositories
import { AccountRepository } from './infrastructure/repositories/account.repository';
import { AccountRelationalRepository } from './infrastructure/repositories/impl/account-relational.repository';
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

// Config
import authConfig from './config/auth.config';
import { UserTokenRelationalRepository } from './infrastructure/repositories/impl/user-token-relational.repository';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    TypeOrmModule.forFeature([AccountEntity, AccountTypeEntity, UserTokenEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // Configuration is handled in strategies
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    {
      provide: AccountRepository,
      useClass: AccountRelationalRepository,
    },
    {
      provide: UserTokenRepository,
      useClass: UserTokenRelationalRepository,
    },
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
