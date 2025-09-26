export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
  refreshJwt: {
    secret: string;
    expiresIn: string;
  };
}

export default (): { auth: AuthConfig } => ({
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    refreshJwt: {
      secret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
  },
});
