export interface JwtPayload {
  sub: string;
  email: string;
  accountTypeId: number;
  iat?: number;
  exp?: number;
}
