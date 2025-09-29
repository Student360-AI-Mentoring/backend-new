# Request Pipeline Documentation

## Overview

The application implements a comprehensive request pipeline that handles incoming requests from middleware through to response formatting, including robust error handling and consistent API response formats.

## Complete Request Flow

```
Request → Middleware → CustomValidationPipe → Controller → Service → ResponseInterceptor → HttpExceptionFilter → Response
```

## Pipeline Components

### 1. Middleware Layer

**RequestIdMiddleware:**

- Checks for or sets `X-Request-Id` header
- Stores correlation ID on `req.requestId` for logging and response tracking
- Ensures all logs and responses share the same correlation identifier

### 2. Validation Layer

**CustomValidationPipe (`src/common/pipes/validation.pipe.ts`):**

- Validates incoming request DTOs using class-validator
- Converts validation errors to snake_case field names
- Whitelists DTO properties and transforms inputs
- Throws `ValidationException` with structured error details
- Prioritizes custom context over default mappings
- Handles system constraints (whitelist validation) automatically

**Key Features:**

```typescript
// Preferred: Custom context for explicit error control
@IsEmail({}, { context: ERRORS.EMAIL01 })
email: string;

// Fallback: System constraints handled automatically
// whitelistValidation → ALEM05 (Unknown Field)
// Other constraints → ALEM02 (Invalid Field) + developer warning
```

### 3. Controller Layer

Controllers focus purely on business logic and endpoint definitions:

- Use predefined error constants for clean service calls
- Utilize documentation decorators for consistent API docs
- Simply return data objects (interceptors handle response wrapping)

### 4. Service Layer

**Business Logic & Error Handling:**

```typescript
// Predefined errors - simple and direct
if (existingUser) {
  throw AUTH_ERRORS.USER_ALREADY_EXISTS; // Clean throwing
}

// Custom exceptions with proper status codes
export const AUTH_ERRORS = {
  USER_ALREADY_EXISTS: new BusinessException(
    'USER_ALREADY_EXISTS',
    'User with this email already exists',
    'An account with this email address is already registered in the system',
    409,
  ),
} as const;
```

### 5. Interceptor Layer

**LoggingInterceptor:**

- Logs request method, URL, body and response status/duration
- Uses structured logging with correlation IDs

**TransformInterceptor:**

- Converts response keys from camelCase to snake_case
- Serializes `Date` values to ISO strings
- Maintains data consistency across API responses

**ResponseInterceptor (`src/common/interceptors/response.interceptor.ts`):**

- Wraps handler output in standardized `ApiResponse` format
- Adds `success`, `status`, `meta.timestamp`, `meta.request_id`
- Preserves `pagination` blocks when present
- Ensures consistent response structure

### 6. Exception Handling Layer

**Custom Exception Classes (`src/common/exceptions/`):**

**CustomException:**

- Abstract base class for all custom exceptions
- Provides consistent error response format
- Maintains error code and user message structure

**ValidationException:**

- Handles validation errors with field-specific details
- Returns structured validation error responses
- Contains array of field validation details

**BusinessException:**

- Handles business logic errors
- Customizable error codes and messages
- Supports different HTTP status codes

**InternalException:**

- Handles unexpected server errors
- Provides safe error messages for production
- Logs detailed error information for debugging

### 7. Global Exception Filter

**HttpExceptionFilter (`src/common/filters/http-exception.filter.ts`):**

**Exception Handling Priority:**

1. **Custom Exceptions** (ValidationException, BusinessException, etc.)

   - Uses custom error format and codes
   - Maintains developer-defined error messages

2. **Standard HttpExceptions**

   - Converts to standard format
   - Uses HTTP status codes as error codes

3. **Unexpected Errors**
   - Wraps in InternalException
   - Provides safe error messages
   - Logs full error details for debugging

**Error Logging Strategy:**

- **4xx (Client Errors):** Warning level
- **5xx (Server Errors):** Error level with stack traces

## Response Formats

### Success Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Validation Error Response

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
        "message": "Invalid Email",
        "details": "Please provide a valid email address."
      },
      {
        "field": "password",
        "code": "PASS02",
        "message": "Password Too Short",
        "details": "Password must be at least 8 characters long."
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

### Business Logic Error Response

```json
{
  "success": false,
  "status": 409,
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "User already exists",
    "details": "An account with this email address is already registered in the system"
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

### Internal Server Error Response

```json
{
  "success": false,
  "status": 500,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

## Configuration

### Main Application Setup

```typescript
// main.ts
app.use(requestIdMiddleware);
app.useGlobalPipes(new CustomValidationPipe());
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new ResponseInterceptor());
```

## Development Guidelines

### Error Handling Best Practices

**1. Validation Errors:**

- Always provide custom contexts for validation decorators
- Use appropriate error codes from `error_en.json`
- Include helpful error messages for end users

**2. Business Logic Errors:**

- Use descriptive error codes (e.g., `USER_ALREADY_EXISTS`)
- Provide clear, actionable error messages
- Set appropriate HTTP status codes
- Use predefined error constants for consistency

**3. Error Codes:**

- Keep error codes consistent and meaningful
- Document all custom error codes
- Use hierarchical naming (e.g., `USER_*`, `AUTH_*`)

### Service Layer Guidelines

```typescript
// ✅ Good: Use predefined errors
if (existingUser) {
  throw AUTH_ERRORS.USER_ALREADY_EXISTS;
}

// ❌ Bad: Manual exception creation
throw new ConflictException('User already exists');
```

### Controller Layer Guidelines

```typescript
// ✅ Good: Use documentation decorators
@Post('register')
@AuthDoc.RegisterSummary()
@AuthDoc.RegisterSuccess()
@AuthDoc.RegisterConflict()
async register(@Body() dto: RegisterDto) {
  return await this.authService.register(dto);
}

// ❌ Bad: Verbose inline decorators
@Post('register')
@ApiOperation({ summary: 'Register user' })
@ApiResponse({ status: 201, description: 'User created', ... })
@ApiResponse({ status: 409, description: 'User exists', ... })
```

### DTO Guidelines

```typescript
// ✅ Good: Custom context for validation
export class CreateUserDto {
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsEmail({}, { context: ERRORS.EMAIL01 })
  email: string;

  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @MinLength(8, { context: ERRORS.PASS02 })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, { context: ERRORS.PASS01 })
  password: string;
}
```

## Environment-Specific Behavior

### Development

- Full error details and stack traces
- Detailed console logging
- Developer warnings for missing contexts

### Production

- Safe error messages for external consumption
- Structured logging without sensitive information
- Internal error details logged server-side only

## Security Considerations

- Never expose sensitive information in error messages
- Log detailed errors server-side for debugging
- Use generic messages for authentication failures
- Sanitize all user input through validation pipeline
- Rate limiting and request correlation for monitoring

## Performance Considerations

- Predefined errors are instantiated once at module load
- Efficient error throwing without object creation overhead
- Structured logging with correlation IDs for debugging
- Response transformation happens once at interceptor level

## Troubleshooting

### Common Issues

**Missing Context Warning:**

```
Missing context for constraint 'minLength' on field 'password'
```

**Solution:** Add context to validation decorator:

```typescript
@MinLength(8, { context: ERRORS.PASS02 })
```

**Uncaught Exceptions:**
All uncaught exceptions are automatically wrapped in `InternalException` and logged with full stack traces.

**Invalid Field Errors:**
Fields not defined in DTO are automatically rejected with `ALEM05` (Unknown Field) error.

This pipeline ensures consistent, secure, and maintainable request handling across the entire application while providing excellent developer experience and end-user feedback.
