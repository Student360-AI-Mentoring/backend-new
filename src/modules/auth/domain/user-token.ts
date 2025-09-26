export class UserToken {
  id: number;
  accountId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    accountId: string,
    refreshToken: string,
    expiresAt: Date,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.accountId = accountId;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  updateToken(newRefreshToken: string, newExpiresAt: Date): void {
    this.refreshToken = newRefreshToken;
    this.expiresAt = newExpiresAt;
    this.updatedAt = new Date();
  }
}
