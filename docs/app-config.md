# Application Configuration

This service centralizes app-specific settings through `src/config/app.config.ts`. The configuration is loaded by Nest's `ConfigModule` and exposed to the rest of the app as the `app` namespace. Use `configService.get<AppConfig>('app')` to retrieve a strongly-typed object anywhere in the codebase.

## Why Use ConfigService Instead of process.env?

### ❌ Problems with Direct process.env Usage

**1. No Type Safety:**
```typescript
// ❌ No compile-time checks
const port = process.env.PORT; // string | undefined
const timeout = Number(process.env.TIMEOUT); // Could be NaN
```

**2. No Validation:**
```typescript
// ❌ Invalid values cause runtime errors
const maxConnections = Number(process.env.MAX_CONNECTIONS); // Could be 0, negative, or NaN
```

**3. Scattered Configuration Logic:**
```typescript
// ❌ Configuration logic duplicated everywhere
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
// Same defaults repeated in multiple files
```

**4. No Environment-Specific Defaults:**
```typescript
// ❌ Hard to manage different environments
const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.PROD_API_URL
  : process.env.DEV_API_URL || 'http://localhost:3000';
```

**5. Testing Difficulties:**
```typescript
// ❌ Hard to mock in tests
process.env.DATABASE_URL = 'test://...'; // Global mutation
```

### ✅ Benefits of ConfigService

**1. Type Safety & IntelliSense:**
```typescript
// ✅ Strongly typed with autocompletion
const appConfig = this.configService.getOrThrow('app', { infer: true });
const port = appConfig.port; // number (guaranteed)
const name = appConfig.name; // string (guaranteed)
```

**2. Centralized Validation:**
```typescript
// ✅ Validated once at startup
class AppEnvironment {
  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value))
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  APP_NAME: string;
}
```

**3. Single Source of Truth:**
```typescript
// ✅ Configuration logic centralized
export default registerAs('app', () => {
  validateConfig(process.env, AppEnvironment);

  return {
    port: Number(process.env.APP_PORT) || Number(process.env.PORT) || 3000,
    name: process.env.APP_NAME || 'Student API',
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
```

**4. Environment-Aware Defaults:**
```typescript
// ✅ Smart environment handling
return {
  frontendDomain: process.env.FRONTEND_DOMAIN ||
    (process.env.NODE_ENV === 'production'
      ? 'https://app.production.com'
      : 'http://localhost:3000'),
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};
```

### Key Benefits

1. **Type Safety**: Compile-time checks and IntelliSense support
2. **Validation**: Configuration errors caught at startup, not runtime
3. **Centralized**: Single source of truth for each configuration namespace
4. **Environment-Aware**: Smart defaults based on NODE_ENV
5. **Better DX**: Clear error messages and self-documenting schemas

## Available Settings

| Environment variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Controls environment-sensitive behavior. Swagger auto-enables when not `production`. |
| `APP_NAME` | `Student API` | Identifier used for boot logs (`new Logger(appConfig.name)`). |
| `APP_PORT` / `PORT` | `3000` | Port used when starting the HTTP server. If unset, the app will still default to `3000`. |
| `FRONTEND_DOMAIN` | `http://localhost:3000` | Optional origin allowed in CORS configuration. Falls back to `http://localhost:3000` when absent. |
| `API_PREFIX` | `api` | Global route prefix added in `main.ts` via `app.setGlobalPrefix`. |
| `CORS_ORIGIN` | `http://localhost:3000` | Primary CORS origin setting for cross-origin requests. |
| `CORS_CREDENTIALS` | `true` | Enable credentials in CORS requests (cookies, authorization headers). |
| `JWT_SECRET` | – | **Required** secret key for signing JWT tokens. Must be changed in production. |
| `JWT_EXPIRES_IN` | `24h` | JWT token expiration time (accepts formats like '1d', '2h', '30m'). |
| `SWAGGER_ENABLED` | `true` | Enable/disable Swagger documentation endpoint at `/docs`. |
| `SWAGGER_TITLE` | `Student API` | Title displayed in Swagger documentation. |
| `SWAGGER_DESCRIPTION` | `Student Management API Documentation` | Description shown in Swagger UI. |
| `SWAGGER_VERSION` | `1.0.0` | API version displayed in documentation. |
| `SWAGGER_TAG` | `student-api` | Default tag for Swagger operations. |

## Usage Patterns

- **Bootstrap logger**: `appConfig.name` changes the label on startup logs so multiple services are easy to distinguish.
- **Routing**: `appConfig.apiPrefix` ensures controller routes are always served under `/api` (or whatever you configure) without hard-coding strings.
- **CORS**: The bootstrap routine prefers `CORS_ORIGIN`, then `appConfig.frontendDomain`, then the local fallback. Setting `FRONTEND_DOMAIN` gives an app-level default for all environments.
- **Port selection**: the Nest application listens on `appConfig.port`, keeping the port logic in one place instead of scattering env lookups throughout the code.

## Multi-Module Configuration

Each feature module can define its own configuration namespace for better organization and maintainability.

### Current Module Structure

```
src/config/
├── app.config.ts           # Core application settings
├── all-config.type.ts      # Global configuration type
└── app-config.type.ts      # App-specific configuration type

src/database/config/
├── database-config.ts      # Database connection settings
└── database-config.type.ts # Database configuration type

src/modules/auth/config/    # (Future) Authentication settings
src/modules/mail/config/    # (Future) Email service settings
src/modules/upload/config/  # (Future) File upload settings
```

## Adding Your Own Config Namespace

Follow this pattern whenever a feature module needs its own configuration (mail, file storage, external auth providers, etc.).

1. **Create the config loader** in your module. Example for `MailConfig`:

   ```ts
   // src/modules/mail/config/mail.config.ts
   import { registerAs } from '@nestjs/config';
   import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
   import validateConfig from '@/utils/validations/validate-config';

   class MailEnvironment {
     @IsString()
     MAIL_HOST: string;

     @IsInt()
     @Min(1)
     MAIL_PORT: number;

     @IsEmail()
     MAIL_DEFAULT_SENDER: string;
   }

   export default registerAs('mail', () => {
     validateConfig(process.env, MailEnvironment);

     return {
       host: process.env.MAIL_HOST,
       port: Number(process.env.MAIL_PORT),
       defaultSender: process.env.MAIL_DEFAULT_SENDER,
     };
   });
   ```

2. **Register the config namespace** inside `AppModule` so it is loaded globally:

   ```ts
   // src/app.module.ts
   import databaseConfig from '@/database/config/database-config';
   import mailConfig from '@/modules/mail/config/mail.config';

   @Module({
     imports: [
       ConfigModule.forRoot({
         isGlobal: true,
         load: [appConfig, databaseConfig, mailConfig],
       }),
       // ...
     ],
   })
   export class AppModule {}
   ```

3. **Extend `AllConfigType` (when in use)** – the project ships with `src/config/all-config.type.ts` exposing the `app` and `database` namespaces:

   ```ts
   // src/config/all-config.type.ts
   import { AppConfig } from './app-config.type';
   import { TDatabaseConfig } from '@/database/config/database-config.type';
   import { MailConfig } from '@/modules/mail/config/mail-config.type';

   export type AllConfigType = {
     app: AppConfig;
     database: TDatabaseConfig;
     mail: MailConfig;
     // add other namespaces here
   };
   ```

4. **Inject the typed config in your services**:

   ```ts
   import { ConfigService } from '@nestjs/config';

   @Injectable()
   export class MailService {
     constructor(
       private readonly mailerService: MailerService,
       private readonly configService: ConfigService<AllConfigType>,
     ) {}

     async sendConfirmation(target: string, hash: string): Promise<void> {
       const frontend = this.configService.getOrThrow('app.frontendDomain', {
         infer: true,
       });
       const mailDefaults = this.configService.get('mail', { infer: true });

       const confirmationUrl = new URL(`${frontend}/confirm-email`);
       confirmationUrl.searchParams.set('hash', hash);

       await this.mailerService.sendMail({
         to: target,
         from: mailDefaults?.defaultSender,
         subject: 'Confirm your email',
         text: confirmationUrl.toString(),
       });
     }
   }
   ```

   Passing `{ infer: true }` lets TypeScript follow the shape of the selected namespace, making it much harder to mistype configuration keys.

5. **Stop reading `process.env` directly** in feature code. Load values through `ConfigService` so everything benefits from the namespace validation you defined in the module loader.

   ```ts
   // ✅ Do this inside your service
   const mailConfig = this.configService.getOrThrow('mail', { infer: true });
   const frontendUrl = this.configService.getOrThrow('app.frontendDomain', { infer: true });
   ```

   ```ts
   // ❌ Avoid this pattern
   const mailHost = process.env.MAIL_HOST; // skips validation and duplicates config logic
   const frontendUrl = process.env.FRONTEND_DOMAIN ?? 'http://localhost:3000';
   ```

   When you need new values, add them to the module's config loader and matching type definition before consuming them so every caller reuses the validated namespace.

With these steps in place, you can gradually grow `AllConfigType` as more modules expose their own configuration objects, providing a consistent pattern for future development.
