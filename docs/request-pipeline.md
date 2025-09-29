# Request Pipeline Guide

## Key Points

- Every request receives a correlation id from `src/common/middlewares/request-id.middleware.ts` and the same id is echoed on logs and responses.
- Input validation is centralized in `CustomValidationPipe`, which transforms DTOs, enforces whitelisting, and emits structured error details (with `ALEM*` fallbacks) when constraints are missing custom contexts.
- Controllers and services return plain data or `{ data, pagination }` objects; global interceptors create the public response envelope and convert properties to `snake_case`.
- `HttpExceptionFilter` normalizes every thrown error into the shared `ApiResponse` format and logs with severity based on the HTTP status code.

## End-to-End Flow

```
Client → Express middleware (request id, helmet, compression) → Global pipes → Guards (per route) → Controller → Service
       → ResponseInterceptor → TransformInterceptor → Express response
       ↘ on error: HttpExceptionFilter → standardized error envelope
```

`LoggingInterceptor` surrounds the full Nest execution so that both the inbound request and the final response (success or error) are registered with duration metrics.

## Component Roles

- **Middleware**: Express-level functions that run before Nest handles the request; ideal for cross-cutting concerns like correlation IDs, security headers, or compression.
- **Pipes**: Classes implementing `PipeTransform` that can transform or validate incoming data before it hits controllers; perfect for DTO validation and normalization.
- **Guards**: Authorization checkpoints that decide whether a request can proceed to route handlers, e.g., JWT authentication.
- **Interceptors**: Wrappers around the controller/service execution that can transform outgoing data, augment metadata, or log performance.
- **Exception Filters**: Catch-all components that map thrown errors into the standardized HTTP/JSON shape while handling logging duties.

## Bootstrap & Express Layer

File: `src/main.ts`

- Applies `requestIdMiddleware` before any Nest processing so the `X-Request-Id` header is always present.
- Enables security middleware (`helmet`) and HTTP compression to match production behaviour locally.
- Configures CORS from environment variables, defaulting to the configured frontend domain.
- Sets a global API prefix (`appConfig.apiPrefix`) so every module automatically sits under the same namespace.
- Registers the global validation pipe and exception filter (redundantly enforced through `AppModule` providers for unit-test scenarios).
- Optionally exposes Swagger (disabled only when `SWAGGER_ENABLED=false` in production).

## Request Correlation Middleware

File: `src/common/middlewares/request-id.middleware.ts`

- Reuses an incoming `X-Request-Id` header when present; otherwise generates a UUID.
- Stores the id on `req.requestId` so interceptors, guards, and services can reuse it without re-reading headers.
- Ensures the same id is written back to the outgoing response headers.

## Validation Stage

File: `src/common/pipes/validation.pipe.ts`

- Runs for DTO classes that carry class-validator metadata and skips primitive parameters.
- Transforms plain payloads into their DTO class instances via `class-transformer`.
- Enforces `whitelist` + `forbidNonWhitelisted`, immediately rejecting unknown properties with error code `ALEM05`.
- Pulls custom constraint contexts (`{ context: { code, message, details } }`) into the response; falls back to `ALEM02` when no context is provided.
- Converts property names to `snake_case` before returning validation details so they match the API contract.
- Throws `CommonExceptions.ValidationException`, which the filter later turns into a `400` response with a `details` array (`ValidationDetail`).

## Guards (Opt-in)

File: `src/common/guards/auth.guard.ts`

- `JwtAuthGuard` extracts the Bearer token, verifies it with `JwtService`, and assigns the decoded payload to `request.user`.
- Throws `UnauthorizedException` on missing or invalid tokens; the global exception filter will map that to the standard error format.
- Attach the guard with `@UseGuards(JwtAuthGuard)` on endpoints that require authentication.

## Controller & Service Responsibilities

- Controllers should accept validated DTOs and return domain DTOs or simple objects. They **must not** build response envelopes manually.
- Services encapsulate business rules and throw `CustomException` instances (either directly from `CommonExceptions` or feature-specific factories such as `AuthExceptions` in `src/modules/auth/constants/auth.constants.ts`).
- When pagination is needed, return `{ data, pagination }`. The response interceptor will preserve both sections.

```typescript
// src/modules/auth/auth.service.ts
if (existingAccount) {
  throw AuthExceptions.UserAlreadyExistsException();
}
return { data: users, pagination };
```

## Global Interceptors

Declared in `src/app.module.ts` via `APP_INTERCEPTOR` so they apply to every HTTP route.

- **LoggingInterceptor (`src/common/interceptors/logging.interceptor.ts`)**

  - Logs method, URL, and body when the request arrives.
  - Logs status code and elapsed time once the downstream processing finishes.
  - Gives full visibility for both successful and failed pipelines thanks to `tap()`.

- **ResponseInterceptor (`src/common/interceptors/response.interceptor.ts`)**

  - Ensures the request id is set on both the request object and the outgoing headers.
  - Wraps handler output into `{ success, status, data?, meta, pagination? }` without mutating the original HTTP status.
  - Supports two return patterns: a raw value (becomes `data`) or an object that already contains `data` and optional `pagination`.
  - Leaves room for interceptors or filters downstream by returning an RxJS stream.

- **TransformInterceptor (`src/common/interceptors/transform.interceptor.ts`)**
  - Converts all object keys to `snake_case` (recursing arrays and nested objects).
  - Serializes `Date` instances to ISO strings, including the meta timestamp produced by the response interceptor.
  - Leaves scalar values untouched, so primitives (e.g., booleans) return as-is.

The practical order is: Logging (outermost) → Response → Transform. This makes sure the response wrapper is built before the payload is converted to `snake_case`, and the logger captures the final status code.

## Exception Handling

### Custom Exceptions

File: `src/common/exceptions/custom.exception.ts`

- Extends Nest's `HttpException` with an additional `code` and optional `details` payload.
- Factory helpers include: `InternalException`, `ValidationException`, `UserAlreadyExistsException`, `UserNotFoundException`, and `InvalidCredentialsException`.
- Feature modules (e.g., `AuthExceptions`) build on top of the same class to keep error semantics consistent across the codebase.

### Global Filter

File: `src/common/filters/http-exception.filter.ts`

- Captures everything thrown during request processing.
- Resolution order:
  1. `CustomException` → returns status from the instance and copies `{ code, message, details }` into the response body.
  2. Any `HttpException` → maps to an error with `code = HttpStatus[status]` and `message = exception.message`.
  3. Unknown errors → wrapped in `CommonExceptions.InternalException` with status 500.
- Uses `ErrorResponseHelper` (`src/utils/helpers/error-response.helper.ts`) to build the final `ApiResponse`, including `meta.request_id` and ISO timestamps.
- Logging policy: client errors (`4xx`) log as warnings; server errors (`5xx`) log as errors with stack traces when available.

## Response Formats

### Success

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

### Validation Error

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

### Business Error

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

## Extending the Pipeline

- Add new global behaviour as interceptors instead of duplicating logic in controllers. Register them with `APP_INTERCEPTOR` to preserve ordering.
- When introducing new validation rules, always supply `{ context: { code, message, details } }` on the decorator so the API receives meaningful error codes.
- Use `CustomException` factories for reusable domain errors; prefer to define them alongside feature modules (see `AuthExceptions`).
- If a feature needs additional request metadata, attach it to the request object after the middleware stage so interceptors and filters can read it.

## Reference Types

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

Keep this file in sync whenever the response contract evolves.
