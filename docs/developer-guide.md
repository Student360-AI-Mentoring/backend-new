# Developer Guide

Comprehensive coding conventions, patterns, and best practices for this NestJS multi-module application.

## Table of Contents

1. [Module Structure](#module-structure)
2. [Error Handling Patterns](#error-handling-patterns)
3. [Controller Conventions](#controller-conventions)
4. [Service Layer Patterns](#service-layer-patterns)
5. [DTO Patterns](#dto-patterns)
6. [Documentation Patterns](#documentation-patterns)
7. [Configuration Setup](#configuration-setup)
8. [Code Style Guidelines](#code-style-guidelines)

## Multi-Module Architecture

Each feature is encapsulated in its own module with clear boundaries:

```
src/modules/
├── auth/              # Authentication & authorization
├── student-ids/       # Student ID management
└── (future modules)   # Users, roles, notifications, etc.
```

## Module Structure

### Standard Module Organization

```
src/modules/your-module/
├── constants/
│   ├── your-module.constants.ts      # Error constants & success messages
│   └── your-module-doc.constants.ts  # Swagger documentation decorators
├── domain/
│   └── your-entity.ts                # Domain entity (business logic)
├── dto/
│   ├── create-your-entity.dto.ts     # Create DTO with validation
│   ├── update-your-entity.dto.ts     # Update DTO (partial)
│   └── your-entity-response.dto.ts   # Response DTO
├── infrastructure/
│   ├── entities/
│   │   └── your-entity.entity.ts     # Database entity (TypeORM)
│   ├── mappers/
│   │   └── your-entity.mapper.ts     # Domain ↔ Infrastructure mapping
│   └── repositories/
│       ├── your-entity.repository.ts # Abstract repository interface
│       └── your-entity-relational.repository.ts # TypeORM implementation
├── your-module.controller.ts         # HTTP endpoints
├── your-module.service.ts            # Business logic
└── your-module.module.ts            # Module definition
```

### Creating a New Module

1. **Generate the module structure:**

2. **Follow the directory structure above**

3. **Create constants, DTOs, and infrastructure layers**

4. **Register in `AppModule` if needed**

---

## Error Handling Patterns

### 1. Define Error Constants

**Create `constants/your-module.constants.ts`:**

```typescript
// src/modules/auth/constants/auth.constants.ts
export const AuthExceptions = {
  UserAlreadyExistsException: (message?: string, details?: unknown) =>
    new CustomException(
      'USER_ALREADY_EXISTS',
      message || 'User with this email already exists',
      HttpStatus.CONFLICT,
      details,
    ),

  InvalidCredentialsException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_CREDENTIALS', message || 'Invalid credentials', HttpStatus.UNAUTHORIZED, details),

  AccountInactiveException: (message?: string, details?: unknown) =>
    new CustomException('ACCOUNT_INACTIVE', message || 'Account is inactive', HttpStatus.UNAUTHORIZED, details),

  AccountNotFoundException: (message?: string, details?: unknown) =>
    new CustomException('ACCOUNT_NOT_FOUND', message || 'Account not found', HttpStatus.NOT_FOUND, details),

  InvalidRefreshTokenException: (message?: string, details?: unknown) =>
    new CustomException('INVALID_REFRESH_TOKEN', message || 'Invalid refresh token', HttpStatus.UNAUTHORIZED, details),

  NationalStudentIdNotFoundException: (message?: string, details?: unknown) =>
    new CustomException(
      'NATIONAL_STUDENT_ID_NOT_FOUND',
      message || 'National Student ID not found',
      HttpStatus.NOT_FOUND,
      details,
    ),
};
```

### 2. Use in Services

**❌ Don't do this:**
```typescript
throw new NotFoundException(`Entity ${id} not found`);
throw new ConflictException('Entity already exists');
```

**✅ Do this:**
```typescript
throw AuthExceptions.UserAlreadyExistsException();
```

---

## Controller Conventions

### 1. Controllers Should NOT Validate

Controllers should be thin and delegate everything to services. **No validation logic in controllers.**

**❌ Don't do this:**
```typescript
@Post()
async create(@Body() dto: CreateEntityDto) {
  if (!dto.name) {
    throw new BadRequestException('Name is required');
  }
  if (dto.name.length < 3) {
    throw new BadRequestException('Name too short');
  }
  return this.service.create(dto);
}
```

**✅ Do this:**
```typescript
@Post()
@EntityDoc.CreateSummary()
@EntityDoc.CreateSuccess()
@EntityDoc.CreateBadRequest()
@EntityDoc.CreateConflict()
async create(@Body() dto: CreateEntityDto): Promise<EntityResponseDto> {
  return this.service.create(dto); // return only needed data
}
```

### 2. What Controllers Should Return

Controllers should return **plain data objects**. The `ResponseInterceptor` will wrap them in the standard `ApiResponse` format.

**✅ Return patterns:**
```typescript
// Single entity
return entityResponseDto;

// Simple message
return { message: SUCCESS_MESSAGES.ENTITY_CREATED };

// Void for deletions (204 No Content)
return; // or Promise<void>
```

**❌ Don't wrap responses manually:**
```typescript
return {
  success: true,
  data: entity,
  meta: { timestamp: new Date() }
}; // ResponseInterceptor will do this
```

### 3. Use Documentation Decorators

**Create reusable decorators in `constants/your-module-doc.constants.ts`:**

```typescript
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const EntityDoc = {
  CreateSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create Entity',
        description: 'Create a new entity with the provided data',
      }),
    ),

  CreateSuccess: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Entity created successfully',
        // ... detailed schema
      }),
    ),

  CreateConflict: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Entity already exists',
        // ... error schema
      }),
    ),
};
```

**Then use in controllers:**
```typescript
@Post()
@EntityDoc.CreateSummary()
@EntityDoc.CreateSuccess()
@EntityDoc.CreateBadRequest()
@EntityDoc.CreateConflict()
@HttpCode(HttpStatus.CREATED)
async create(@Body() dto: CreateEntityDto) {
  return this.service.create(dto);
}
```

### 4. HTTP Status Codes

Use appropriate HTTP status codes:

- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Authorization failed
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Unexpected errors

---

## Service Layer Patterns

### 1. Service Responsibilities

Services contain **business logic** and coordinate between repositories:

```typescript
@Injectable()
export class YourEntityService {
  constructor(
    private readonly repository: YourEntityRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateEntityDto): Promise<EntityResponseDto> {
    // Business rule validation
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw YOUR_MODULE_ERRORS.ENTITY_ALREADY_EXISTS;
    }

    // Business logic
    const entity = await this.repository.create({
      ...dto,
      slug: this.generateSlug(dto.name),
      status: 'active',
    });

    // Return response DTO
    return this.toResponseDto(entity);
  }

  private generateSlug(name: string): string {
    // Business logic helper
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private toResponseDto(entity: YourEntity): EntityResponseDto {
    // Mapping logic
    const dto = new EntityResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.slug = entity.slug;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
```

### 2. Service Naming Conventions

- Use **descriptive method names**: `findById`, `findByEmail`, `createUser`, `updatePassword`
- Use **async/await** for all asynchronous operations
- Return **DTOs**, not domain entities directly
- Keep methods **focused** and **single-responsibility**

### 3. Error Handling in Services

```typescript
async findById(id: string): Promise<EntityResponseDto> {
  const entity = await this.repository.findById(id);

  if (!entity) {
    throw YOUR_MODULE_ERRORS.ENTITY_NOT_FOUND;
  }

  return this.toResponseDto(entity);
}
```

---

## DTO Patterns

### 1. Create DTOs with Validation

**`dto/create-your-entity.dto.ts`:**

```typescript
export class CreateYourEntityDto {
  @ApiProperty({
    name: 'name',
    example: 'Entity Name',
    description: 'Name of the entity',
    required: true,
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.ALEM02 })
  @Expose()
  name: string;

  @ApiProperty({
    name: 'description',
    example: 'Entity description',
    description: 'Optional description of the entity',
    required: false,
  })
  @IsOptional()
  @IsString({ context: ERRORS.ALEM02 })
  @Expose()
  description?: string;

  @ApiProperty({
    name: 'priority',
    example: 5,
    description: 'Priority level (1-10)',
    minimum: 1,
    maximum: 10,
  })
  @IsInt({ context: ERRORS.ACC01 })
  @Min(1, { context: ERRORS.ALEM03 })
  @Max(10, { context: ERRORS.ALEM04 })
  @Expose()
  priority: number;
}
```

### 2. Update DTOs

**`dto/update-your-entity.dto.ts`:**

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateYourEntityDto } from './create-your-entity.dto';

export class UpdateYourEntityDto extends PartialType(CreateYourEntityDto) {}
```

### 3. Response DTOs

**`dto/your-entity-response.dto.ts`:**

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class YourEntityResponseDto {
  @ApiProperty({
    example: 'uuid-string',
    description: 'Unique identifier'
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Entity Name',
    description: 'Name of the entity'
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'entity-name',
    description: 'URL-friendly slug'
  })
  @Expose()
  slug: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Creation timestamp'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Last update timestamp'
  })
  @Expose()
  updatedAt: Date;
}
```

### 4. DTO Validation Rules

**Always provide custom context for validation:**

```typescript
// ✅ Good - explicit error context
@IsNotEmpty({ context: ERRORS.ALEM01 })
@IsEmail({}, { context: ERRORS.EMAIL01 })

// ❌ Bad - no context (will show developer warning)
@IsNotEmpty()
@IsEmail()
```

**Use appropriate validators:**

- `@IsNotEmpty()` - Required fields
- `@IsOptional()` - Optional fields
- `@IsString()`, `@IsInt()`, `@IsEmail()` - Type validation
- `@MinLength()`, `@MaxLength()` - String length
- `@Min()`, `@Max()` - Number range
- `@Matches()` - Regex patterns
- `@Transform()` - Data transformation

---

## Configuration Setup

### 1. Creating Module Configuration

When your module needs configuration, follow this pattern:

**`config/your-module.config.ts`:**

```typescript
import { registerAs } from '@nestjs/config';
import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import validateConfig from '@/utils/validations/validate-config';

class YourModuleEnvironment {
  @IsString()
  YOUR_MODULE_API_KEY: string;

  @IsInt()
  @Min(1)
  YOUR_MODULE_TIMEOUT: number;

  @IsOptional()
  @IsString()
  YOUR_MODULE_BASE_URL?: string;
}

export default registerAs('yourModule', () => {
  validateConfig(process.env, YourModuleEnvironment);

  return {
    apiKey: process.env.YOUR_MODULE_API_KEY,
    timeout: Number(process.env.YOUR_MODULE_TIMEOUT || 5000),
    baseUrl: process.env.YOUR_MODULE_BASE_URL || 'https://api.default.com',
  };
});
```

**`config/your-module-config.type.ts`:**

```typescript
export type YourModuleConfig = {
  apiKey: string;
  timeout: number;
  baseUrl: string;
};
```

### 2. Register Configuration

**Add to `app.module.ts`:**

```typescript
import yourModuleConfig from '@/modules/your-module/config/your-module.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, yourModuleConfig],
    }),
    // ...
  ],
})
export class AppModule {}
```

### 3. Use Configuration in Services

```typescript
@Injectable()
export class YourModuleService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private getModuleConfig() {
    return this.configService.getOrThrow('yourModule', { infer: true });
  }

  async someOperation() {
    const config = this.getModuleConfig();
    // Use config.apiKey, config.timeout, etc.
  }
}
```

---

## Code Style Guidelines

### 1. Naming Conventions

**Files and Directories:**
- Use **kebab-case**: `user-profile.service.ts`, `auth-login.dto.ts`
- Be descriptive: `student-id-response.dto.ts` not `response.dto.ts`

**Classes:**
- Use **PascalCase**: `UserProfileService`, `AuthLoginDto`
- Suffix by type: `Service`, `Controller`, `Module`, `Entity`, `Dto`

**Methods and Variables:**
- Use **camelCase**: `findUserById`, `createNewAccount`
- Be descriptive: `isPasswordValid` not `isValid`

**Constants:**
- Use **SCREAMING_SNAKE_CASE**: `USER_ALREADY_EXISTS`, `MAX_LOGIN_ATTEMPTS`

### 2. Import Organization

```typescript
// 1. Node modules
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 2. Internal modules (absolute paths)
import { BusinessException } from '@/common/exceptions';
import { UserRepository } from '@/modules/users/infrastructure/repositories';

// 3. Relative imports (same module)
import { CreateUserDto } from './dto/create-user.dto';
import { USER_ERRORS } from './constants/user.constants';
```

### 3. Method Organization

```typescript
@Injectable()
export class YourService {
  // 1. Constructor
  constructor(private readonly repository: YourRepository) {}

  // 2. Public methods (alphabetical)
  async create(dto: CreateDto): Promise<ResponseDto> {}
  async delete(id: string): Promise<void> {}
  async findById(id: string): Promise<ResponseDto> {}
  async update(id: string, dto: UpdateDto): Promise<ResponseDto> {}

  // 3. Private methods (alphabetical)
  private generateSlug(name: string): string {}
  private toResponseDto(entity: Entity): ResponseDto {}
  private validateBusinessRules(data: any): void {}
}
```

### 4. Error Handling Best Practices

```typescript
// ✅ Good - specific, actionable errors
throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
throw USER_ERRORS.INVALID_PASSWORD_FORMAT;

// ❌ Bad - generic, unclear errors
throw new Error('Something went wrong');
throw new BadRequestException('Invalid data');
```

### 5. Async/Await Usage

```typescript
// ✅ Good
async create(dto: CreateDto): Promise<ResponseDto> {
  const existing = await this.repository.findByEmail(dto.email);
  if (existing) {
    throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
  }
  return await this.repository.create(dto);
}

// ❌ Bad - mixing promises and async/await
async create(dto: CreateDto): Promise<ResponseDto> {
  return this.repository.findByEmail(dto.email)
    .then(existing => {
      if (existing) throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
      return this.repository.create(dto);
    });
}
```

---

## Summary Checklist

When creating a new module, ensure you have:

- [ ] **Standard directory structure** (domain, dto, infrastructure, constants)
- [ ] **Predefined error constants** with appropriate status codes
- [ ] **Clean controllers** (no validation, use doc decorators)
- [ ] **Business logic in services** (error handling, data transformation)
- [ ] **DTOs with validation contexts** (custom error contexts)
- [ ] **Documentation decorators** for Swagger
- [ ] **Configuration setup** (if needed)
- [ ] **Response DTOs** (not domain entities)
- [ ] **Consistent naming** and **import organization**

This guide ensures consistency across all modules and provides a clear path for new developers to contribute effectively to the codebase.
