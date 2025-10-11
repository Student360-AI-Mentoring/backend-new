# Cấu hình Ứng dụng

Dịch vụ này gom tập trung các thiết lập đặc thù của ứng dụng thông qua `src/config/app.config.ts`. Cấu hình được nạp bởi `ConfigModule` của Nest và cung cấp cho toàn bộ ứng dụng dưới namespace `app`. Dùng `configService.get<AppConfig>('app')` để lấy đối tượng có kiểu rõ ràng ở bất cứ đâu trong codebase.

## Vì sao nên dùng ConfigService thay vì process.env?

### ❌ Vấn đề khi truy cập trực tiếp process.env

**1. Không có an toàn kiểu:**
```typescript
// ❌ Không kiểm tra ở thời điểm biên dịch
const port = process.env.PORT; // string | undefined
const timeout = Number(process.env.TIMEOUT); // Có thể là NaN
```

**2. Không có xác thực:**
```typescript
// ❌ Giá trị không hợp lệ gây lỗi lúc chạy
const maxConnections = Number(process.env.MAX_CONNECTIONS); // Có thể bằng 0, âm hoặc NaN
```

**3. Logic cấu hình bị rải rác:**
```typescript
// ❌ Logic cấu hình bị lặp ở khắp nơi
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;
// Cùng một giá trị mặc định được lặp lại trong nhiều file
```

**4. Không có mặc định theo môi trường:**
```typescript
// ❌ Khó quản lý nhiều môi trường
const apiUrl = process.env.NODE_ENV === 'production'
  ? process.env.PROD_API_URL
  : process.env.DEV_API_URL || 'http://localhost:3000';
```

**5. Khó kiểm thử:**
```typescript
// ❌ Khó giả lập trong kiểm thử
process.env.DATABASE_URL = 'test://...'; // Đột biến toàn cục
```

### ✅ Lợi ích của ConfigService

**1. An toàn kiểu & IntelliSense:**
```typescript
// ✅ Kiểu mạnh với gợi ý tự động
const appConfig = this.configService.getOrThrow('app', { infer: true });
const port = appConfig.port; // number (đảm bảo)
const name = appConfig.name; // string (đảm bảo)
```

**2. Xác thực tập trung:**
```typescript
// ✅ Được kiểm tra một lần khi khởi động
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

**3. Một nguồn sự thật duy nhất:**
```typescript
// ✅ Logic cấu hình nằm tập trung
export default registerAs('app', () => {
  validateConfig(process.env, AppEnvironment);

  return {
    port: Number(process.env.APP_PORT) || Number(process.env.PORT) || 3000,
    name: process.env.APP_NAME || 'Student API',
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});
```

**4. Mặc định theo môi trường:**
```typescript
// ✅ Xử lý thông minh theo môi trường
return {
  frontendDomain: process.env.FRONTEND_DOMAIN ||
    (process.env.NODE_ENV === 'production'
      ? 'https://app.production.com'
      : 'http://localhost:3000'),
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};
```

### Điểm mạnh chính

1. **An toàn kiểu**: Kiểm tra từ lúc biên dịch và hỗ trợ IntelliSense
2. **Xác thực**: Bắt lỗi cấu hình ngay khi khởi động, không phải lúc runtime
3. **Tập trung**: Mỗi namespace cấu hình có một nguồn thống nhất
4. **Nhận biết môi trường**: Mặc định thông minh dựa trên NODE_ENV
5. **Cải thiện DX**: Thông báo lỗi rõ ràng và schema tự mô tả

## Thiết lập sẵn có

| Biến môi trường | Mặc định | Mô tả |
| --- | --- | --- |
| `NODE_ENV` | `development` | Điều khiển hành vi phụ thuộc môi trường. Swagger tự bật khi không phải `production`. |
| `APP_NAME` | `Student API` | Định danh dùng trong log khởi động (`new Logger(appConfig.name)`). |
| `APP_PORT` / `PORT` | `3000` | Cổng khi khởi chạy HTTP server. Nếu không đặt, ứng dụng vẫn mặc định `3000`. |
| `FRONTEND_DOMAIN` | `http://localhost:3000` | Origin tùy chọn cho cấu hình CORS. Rơi về `http://localhost:3000` khi trống. |
| `API_PREFIX` | `api` | Tiền tố route toàn cục thêm trong `main.ts` thông qua `app.setGlobalPrefix`. |
| `CORS_ORIGIN` | `http://localhost:3000` | Origin chính cho các request cross-origin. |
| `CORS_CREDENTIALS` | `true` | Cho phép gửi thông tin đăng nhập trong request CORS (cookie, header authorization). |
| `JWT_SECRET` | – | **Bắt buộc**: khóa bí mật để ký JWT. Phải thay đổi ở môi trường production. |
| `JWT_EXPIRES_IN` | `24h` | Thời gian hết hạn của JWT (chấp nhận các định dạng như '1d', '2h', '30m'). |
| `SWAGGER_ENABLED` | `true` | Bật/tắt endpoint tài liệu Swagger tại `/docs`. |
| `SWAGGER_TITLE` | `Student API` | Tiêu đề hiển thị trong tài liệu Swagger. |
| `SWAGGER_DESCRIPTION` | `Student Management API Documentation` | Mô tả hiển thị trong Swagger UI. |
| `SWAGGER_VERSION` | `1.0.0` | Phiên bản API trong tài liệu. |
| `SWAGGER_TAG` | `student-api` | Tag mặc định cho các thao tác Swagger. |

## Mẫu sử dụng

- **Bootstrap logger**: `appConfig.name` thay đổi nhãn log khởi động giúp phân biệt nhiều dịch vụ dễ dàng.
- **Routing**: `appConfig.apiPrefix` đảm bảo mọi controller phục vụ dưới `/api` (hoặc giá trị bạn cấu hình) mà không phải hard-code chuỗi.
- **CORS**: Quy trình khởi động ưu tiên `CORS_ORIGIN`, sau đó `appConfig.frontendDomain`, cuối cùng là giá trị fallback cục bộ. Đặt `FRONTEND_DOMAIN` giúp có mặc định cấp ứng dụng cho mọi môi trường.
- **Chọn port**: Ứng dụng Nest lắng nghe trên `appConfig.port`, giữ logic port ở một nơi thay vì rải rác các lần đọc env.

## Cấu hình Đa mô-đun

Mỗi mô-đun tính năng có thể định nghĩa namespace cấu hình riêng để dễ tổ chức và bảo trì.

### Cấu trúc mô-đun hiện tại

```
src/config/
├── app.config.ts           # Cài đặt cốt lõi của ứng dụng
├── all-config.type.ts      # Kiểu cấu hình toàn cục
└── app-config.type.ts      # Kiểu cấu hình riêng của app

src/database/config/
├── database-config.ts      # Thiết lập kết nối cơ sở dữ liệu
└── database-config.type.ts # Kiểu cấu hình cơ sở dữ liệu

src/modules/auth/config/    # (Tương lai) Cấu hình xác thực
src/modules/mail/config/    # (Tương lai) Cấu hình dịch vụ email
src/modules/upload/config/  # (Tương lai) Cấu hình upload tệp
```

## Thêm namespace cấu hình của riêng bạn

Áp dụng mẫu này khi mô-đun tính năng cần cấu hình riêng (mail, lưu trữ tệp, nhà cung cấp xác thực bên ngoài, v.v.).

1. **Tạo loader cấu hình** trong mô-đun. Ví dụ cho `MailConfig`:

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

2. **Đăng ký namespace cấu hình** trong `AppModule` để nạp toàn cục:

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

3. **Mở rộng `AllConfigType` (khi được sử dụng)** – dự án cung cấp sẵn `src/config/all-config.type.ts` với namespace `app` và `database`:

   ```ts
   // src/config/all-config.type.ts
   import { AppConfig } from './app-config.type';
   import { TDatabaseConfig } from '@/database/config/database-config.type';
   import { MailConfig } from '@/modules/mail/config/mail-config.type';

   export type AllConfigType = {
     app: AppConfig;
     database: TDatabaseConfig;
     mail: MailConfig;
     // thêm các namespace khác tại đây
   };
   ```

4. **Inject cấu hình có kiểu trong service**:

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

   Tham số `{ infer: true }` giúp TypeScript suy ra hình dạng namespace đã chọn, hạn chế tối đa việc gõ sai khóa cấu hình.

5. **Dừng đọc trực tiếp `process.env`** trong code tính năng. Hãy lấy giá trị thông qua `ConfigService` để mọi thứ kế thừa phần xác thực namespace bạn đã định nghĩa trong loader mô-đun.

   ```ts
   // ✅ Thực hiện trong service của bạn
   const mailConfig = this.configService.getOrThrow('mail', { infer: true });
   const frontendUrl = this.configService.getOrThrow('app.frontendDomain', { infer: true });
   ```

   ```ts
   // ❌ Tránh mẫu này
   const mailHost = process.env.MAIL_HOST; // bỏ qua bước xác thực và lặp lại logic
   const frontendUrl = process.env.FRONTEND_DOMAIN ?? 'http://localhost:3000';
   ```

   Khi cần giá trị mới, hãy thêm chúng vào loader cấu hình của mô-đun và kiểu tương ứng trước khi sử dụng để mọi nơi đều dùng chung namespace đã xác thực.

Với các bước này, bạn có thể mở rộng `AllConfigType` dần dần khi nhiều mô-đun cung cấp đối tượng cấu hình riêng, đảm bảo mẫu làm việc nhất quán cho các phát triển về sau.
