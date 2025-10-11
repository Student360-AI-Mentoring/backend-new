# Hướng dẫn Pipeline Request

## Ý Chính

- Mỗi request nhận một correlation id từ `src/common/middlewares/request-id.middleware.ts` và id này được ghi lại trong log cũng như phản hồi.
- Việc kiểm tra dữ liệu đầu vào được tập trung trong `CustomValidationPipe`, chuyển đổi DTO, bật whitelist và trả về chi tiết lỗi có cấu trúc (fallback `ALEM*` nếu thiếu context tùy chỉnh).
- Controller và service chỉ trả về dữ liệu thuần hoặc đối tượng `{ data, pagination }`; các interceptor toàn cục xây dựng lớp bọc phản hồi công khai và chuyển khóa sang `snake_case`.
- `HttpExceptionFilter` chuẩn hóa mọi lỗi thành định dạng `ApiResponse` dùng chung và log với cấp độ phù hợp dựa trên HTTP status code.

## Luồng End-to-End

```
Client → Express middleware (request id, helmet, compression) → Global pipes → Guards (theo route) → Controller → Service
       → ResponseInterceptor → TransformInterceptor → Express response
       ↘ khi lỗi: HttpExceptionFilter → gói lỗi chuẩn hóa
```

`LoggingInterceptor` bao quanh toàn bộ quá trình thực thi của Nest, do đó cả request vào và phản hồi cuối cùng (thành công hoặc lỗi) đều được ghi nhận kèm thời gian xử lý.

## Vai Trò Thành Phần

- **Middleware**: Hàm mức Express chạy trước khi Nest xử lý request; lý tưởng cho các mối quan tâm xuyên suốt như correlation ID, header bảo mật hoặc nén.
- **Pipe**: Lớp triển khai `PipeTransform` dùng để biến đổi/kiểm tra dữ liệu trước khi vào controller; phù hợp cho validation và chuẩn hóa DTO.
- **Guard**: Điểm kiểm soát phân quyền quyết định request có được phép tới handler hay không, ví dụ guard JWT.
- **Interceptor**: Lớp bao quanh controller/service, có thể biến đổi dữ liệu trả về, bổ sung metadata hoặc log hiệu năng.
- **Exception Filter**: Bắt mọi lỗi phát sinh và ánh xạ về cấu trúc HTTP/JSON chuẩn trong khi vẫn chịu trách nhiệm log.

## Bootstrap & Lớp Express

File: `src/main.ts`

- Áp dụng `requestIdMiddleware` trước mọi xử lý của Nest để header `X-Request-Id` luôn hiện diện.
- Bật middleware bảo mật (`helmet`) và nén HTTP để môi trường local giống production.
- Cấu hình CORS từ biến môi trường, mặc định về domain frontend được định nghĩa.
- Thiết lập prefix API toàn cục (`appConfig.apiPrefix`) để mọi mô-đun dùng chung namespace.
- Đăng ký global validation pipe và exception filter (được khai báo dư phòng trong `AppModule` để phục vụ unit test).
- Swagger chỉ hiển thị khi `SWAGGER_ENABLED` không bị đặt `false` ở môi trường production.

## Middleware Gắn ID Request

File: `src/common/middlewares/request-id.middleware.ts`

- Tái sử dụng header `X-Request-Id` nếu client truyền vào; nếu không sẽ sinh UUID mới.
- Ghi id vào `req.requestId` để interceptor, guard và service dùng lại mà không cần đọc header.
- Đảm bảo id giống nhau được trả về trong response headers.

## Giai Đoạn Validation

File: `src/common/pipes/validation.pipe.ts`

- Chạy với các DTO có metadata class-validator và bỏ qua tham số nguyên thủy.
- Chuyển payload thuần thành instance DTO thông qua `class-transformer`.
- Bật `whitelist` + `forbidNonWhitelisted`, loại ngay thuộc tính lạ với mã lỗi `ALEM05`.
- Lấy `{ context: { code, message, details } }` từ decorator validation đưa vào phản hồi; fallback `ALEM02` nếu không có context.
- Chuyển tên thuộc tính sang `snake_case` trước khi trả chi tiết lỗi để khớp hợp đồng API.
- Ném `CommonExceptions.ValidationException`, sau đó filter chuyển thành phản hồi `400` chứa mảng `details` (`ValidationDetail`).

## Guard (Tùy chọn)

File: `src/common/guards/auth.guard.ts`

- `JwtAuthGuard` đọc Bearer token, xác thực bằng `JwtService` và gán payload giải mã vào `request.user`.
- Ném `UnauthorizedException` khi token thiếu hoặc không hợp lệ; exception filter sẽ ánh xạ về định dạng lỗi chuẩn.
- Đính guard với `@UseGuards(JwtAuthGuard)` trên endpoint yêu cầu đăng nhập.

## Trách Nhiệm Controller & Service

- Controller nhận DTO đã được validate và trả về DTO domain hoặc đối tượng đơn giản. **Không** tự xây dựng lớp bọc phản hồi.
- Service bao gói quy tắc nghiệp vụ và ném `CustomException` (dùng `CommonExceptions` hoặc factory đặc thù như `AuthExceptions` trong `src/modules/auth/constants/auth.constants.ts`).
- Khi cần phân trang, trả `{ data, pagination }`; response interceptor sẽ giữ nguyên hai phần này.

```typescript
// src/modules/auth/auth.service.ts
if (existingAccount) {
  throw AuthExceptions.UserAlreadyExistsException();
}
return { data: users, pagination };
```

## Interceptor Toàn cục

Khai báo trong `src/app.module.ts` qua `APP_INTERCEPTOR` để áp dụng cho mọi route HTTP.

- **LoggingInterceptor (`src/common/interceptors/logging.interceptor.ts`)**

  - Log method, URL và body khi request tới.
  - Log status code và thời gian thực thi sau khi pipeline hoàn tất.
  - Theo dõi đầy đủ cả luồng thành công và thất bại nhờ `tap()`.

- **ResponseInterceptor (`src/common/interceptors/response.interceptor.ts`)**

  - Đảm bảo request id có trên đối tượng request và header phản hồi.
  - Bọc kết quả handler thành `{ success, status, data?, meta, pagination? }` mà không đổi HTTP status gốc.
  - Hỗ trợ hai mẫu trả về: giá trị thuần (trở thành `data`) hoặc đối tượng đã chứa `data` và `pagination`.
  - Giữ không gian cho interceptor/filter phía sau bằng cách trả về stream RxJS.

- **TransformInterceptor (`src/common/interceptors/transform.interceptor.ts`)**
  - Chuyển mọi khóa đối tượng sang `snake_case` (đệ quy cả array và object lồng nhau).
  - Chuẩn hóa `Date` thành ISO string, gồm cả timestamp trong `meta`.
  - Không đụng tới giá trị nguyên thủy, nên boolean/number vẫn được giữ nguyên.

Thứ tự thực tế: Logging (lớp ngoài cùng) → Response → Transform. Cách này đảm bảo wrapper phản hồi được dựng trước khi payload chuyển sang `snake_case`, đồng thời logger có được status code cuối cùng.

## Xử Lý Ngoại Lệ

### Custom Exception

File: `src/common/exceptions/custom.exception.ts`

- Mở rộng `HttpException` của Nest với trường `code` và `details` tùy chọn.
- Các factory sẵn có: `InternalException`, `ValidationException`, `UserAlreadyExistsException`, `UserNotFoundException`, `InvalidCredentialsException`.
- Những mô-đun chức năng (ví dụ `AuthExceptions`) kế thừa cùng lớp để giữ ngữ nghĩa lỗi nhất quán.

### Global Filter

File: `src/common/filters/http-exception.filter.ts`

- Bắt mọi lỗi trong quá trình xử lý request.
- Thứ tự phân giải:
  1. `CustomException` → dùng status của instance và copy `{ code, message, details }` vào body.
  2. `HttpException` bất kỳ → ánh xạ về lỗi với `code = HttpStatus[status]`, `message = exception.message`.
  3. Lỗi không xác định → bọc trong `CommonExceptions.InternalException` với status 500.
- Dùng `ErrorResponseHelper` (`src/utils/helpers/error-response.helper.ts`) để xây dựng `ApiResponse`, bao gồm `meta.request_id` và timestamp ISO.
- Chính sách log: lỗi client (`4xx`) log ở mức warning; lỗi server (`5xx`) log ở mức error kèm stack trace nếu có.

## Định Dạng Phản Hồi

### Thành công

```json
{
  "success": true,
  "status": 200,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Lỗi Validation

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "code": "EMAIL01",
        "message": "Invalid email format",
        "details": "Please provide a valid email address"
      },
      {
        "field": "password",
        "code": "ALEM02",
        "message": "This field format is invalid",
        "details": "password must be longer than or equal to 8 characters"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

### Lỗi Nghiệp vụ

```json
{
  "success": false,
  "status": 409,
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "User with this email already exists",
    "details": null
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

## Mở Rộng Pipeline

- Thêm hành vi toàn cục bằng interceptor thay vì lặp logic trong controller. Đăng ký với `APP_INTERCEPTOR` để giữ thứ tự.
- Khi bổ sung rule validation mới, luôn cung cấp `{ context: { code, message, details } }` để API có mã lỗi rõ ràng.
- Sử dụng factory `CustomException` cho lỗi domain tái sử dụng; nên định nghĩa cạnh mô-đun tính năng (xem `AuthExceptions`).
- Nếu tính năng cần metadata bổ sung cho request, gắn nó sau giai đoạn middleware để interceptor và filter có thể đọc được.

## Kiểu Tham Chiếu

File: `src/type.d.ts`

```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  error?: IError;
  meta: IMeta;
  pagination?: IPagination;
}
```

Hãy giữ file này đồng bộ mỗi khi hợp đồng phản hồi thay đổi.
