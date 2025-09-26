export interface JwtRefreshPayload {
  sub: string;
  email: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}
