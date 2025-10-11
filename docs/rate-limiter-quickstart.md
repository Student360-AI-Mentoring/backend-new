# Rate Limiter - Hướng dẫn Nhanh

## Tóm tắt

Rate limiter đã được cấu hình bằng `@nestjs/throttler` với các tính năng:

✅ **Giới hạn tốc độ toàn cục** - Tự động áp dụng cho tất cả endpoint  
✅ **Giới hạn tùy chỉnh** - Điều chỉnh cho từng endpoint cụ thể  
✅ **Bỏ qua throttling** - Loại trừ rate limit khi cần  
✅ **Cấu hình theo môi trường** - Điều chỉnh qua biến môi trường  

## Cấu hình

### File `.env`

```env
# Rate Limiting
THROTTLE_TTL=60        # Thời gian (giây)
THROTTLE_LIMIT=10      # Số request tối đa
```

## Sử dụng

### 1. Rate limit mặc định (10 requests/60s)

Tự động áp dụng cho tất cả endpoints.

### 2. Tùy chỉnh cho endpoint

```typescript
import { Throttle } from '@/common/decorators/throttle.decorator';

@Throttle({ ttl: 60, limit: 5 })
@Post('login')
async login() { }
```

### 3. Bỏ qua rate limit

```typescript
import { SkipThrottle } from '@/common/decorators/skip-throttle.decorator';

@SkipThrottle()
@Get('health')
check() { }
```

## Ví dụ đã áp dụng

### Auth Controller

- **Register**: 3 requests/5 phút
- **Login**: 5 requests/1 phút  
- **Refresh**: 10 requests/1 phút

## Response khi vượt giới hạn

**Status Code**: `429 Too Many Requests`

**Headers**:
- `X-RateLimit-Limit`: Giới hạn
- `X-RateLimit-Remaining`: Số còn lại
- `X-RateLimit-Reset`: Thời gian reset
- `Retry-After`: Thời gian chờ (giây)

## Chi tiết

Xem thêm: [docs/rate-limiting.md](./rate-limiting.md)
