import { UserToken } from '../../domain/user-token';

export abstract class UserTokenRepository {
  abstract create(token: { accountId: string; refreshToken: string; expiresAt: Date }): Promise<{ id: number }>;

  abstract findByToken(refreshToken: string): Promise<UserToken | null>;

  abstract findByAccountId(accountId: string): Promise<UserToken[]>;

  abstract update(
    id: number,
    data: {
      refreshToken?: string;
      expiresAt?: Date;
    },
  ): Promise<UserToken | null>;

  abstract delete(id: number): Promise<void>;

  abstract deleteByAccountId(accountId: string): Promise<void>;

  abstract deleteExpiredTokens(): Promise<void>;
}
