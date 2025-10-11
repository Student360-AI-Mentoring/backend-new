# Cấu hình Rate Limiting

Cơ chế giới hạn tốc độ (rate limiting) sử dụng `@nestjs/throttler` để bảo vệ API khỏi các cuộc tấn công brute-force và lạm dụng.

## Cấu hình mặc định

Trong file `.env`:

```env
THROTTLE_TTL=60        # Thời gian tính bằng giây (mặc định: 60s)
THROTTLE_LIMIT=10      # Số request tối đa trong khoảng thời gian TTL (mặc định: 10)
```

Với cấu hình trên, mỗi IP chỉ được phép gửi tối đa **10 requests trong 60 giây**.

## Sử dụng trong Controller

### 1. Áp dụng rate limit mặc định (Global)

Rate limiting được áp dụng tự động cho tất cả endpoints thông qua `ThrottlerGuard`.

### 2. Tùy chỉnh rate limit cho endpoint cụ thể

Sử dụng decorator `@Throttle()`:

```typescript
import { Throttle } from '@/common/decorators/throttle.decorator';

@Controller('auth')
export class AuthController {
  // Cho phép 5 requests trong 60 giây
  @Throttle({ ttl: 60, limit: 5 })
  @Post('login')
  async login(@Body() dto: AuthLoginDto) {
    // ...
  }

  // Cho phép 3 requests trong 300 giây (5 phút)
  @Throttle({ ttl: 300, limit: 3 })
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    // ...
  }
}
```

### 3. Bỏ qua rate limiting cho endpoint cụ thể

Sử dụng decorator `@SkipThrottle()`:

```typescript
import { SkipThrottle } from '@/common/decorators/skip-throttle.decorator';

@Controller('health')
export class HealthController {
  @SkipThrottle()
  @Get()
  check() {
    return { status: 'ok' };
  }
}
```

### 4. Bỏ qua rate limiting cho toàn bộ controller

```typescript
import { SkipThrottle } from '@/common/decorators/skip-throttle.decorator';

@SkipThrottle()
@Controller('public')
export class PublicController {
  // Tất cả endpoints trong controller này sẽ không bị rate limit
}
```

## Response khi vượt quá giới hạn

Khi client vượt quá giới hạn, server sẽ trả về response:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

Header HTTP:
- `X-RateLimit-Limit`: Số request tối đa cho phép
- `X-RateLimit-Remaining`: Số request còn lại
- `X-RateLimit-Reset`: Thời điểm reset (Unix timestamp)
- `Retry-After`: Số giây cần đợi trước khi thử lại

## Ví dụ cấu hình cho các endpoint phổ biến

### Endpoint xác thực
```typescript
@Throttle({ ttl: 60, limit: 5 })   // 5 lần thử mỗi phút
@Post('login')
async login() { }

@Throttle({ ttl: 3600, limit: 3 }) // 3 lần thử mỗi giờ
@Post('reset-password')
async resetPassword() { }
```

### Endpoint API thông thường
```typescript
@Throttle({ ttl: 60, limit: 100 })  // 100 request mỗi phút
@Get('users')
async getUsers() { }
```

### Endpoint công khai
```typescript
@SkipThrottle()
@Get('public-data')
async getPublicData() { }
```

## Thực hành Tốt nhất

1. **Authentication endpoints**: Sử dụng rate limit thấp (3-5 requests/phút) để chống brute-force
2. **API endpoints**: Sử dụng rate limit vừa phải (50-100 requests/phút)
3. **Health check/status**: Bỏ qua rate limiting
4. **File upload**: Sử dụng rate limit thấp với TTL dài hơn

## Kiểm thử

Để test rate limiting:

```bash
# Gửi nhiều requests liên tiếp
for i in {1..15}; do curl http://localhost:3000/api/endpoint; done
```

Sau khi vượt quá giới hạn, bạn sẽ nhận được HTTP 429 response.
