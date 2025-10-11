# Hướng dẫn Nhà phát triển

Bộ quy ước mã hóa, mẫu và thực hành tốt nhất dành cho ứng dụng NestJS đa mô-đun này.

## Mục lục

1. [Cấu trúc Mô-đun](#cau-truc-mo-dun)
2. [Mẫu Xử lý Lỗi](#mau-xu-ly-loi)
3. [Quy ước Controller](#quy-uoc-controller)
4. [Mẫu Tầng Service](#mau-tang-service)
5. [Mẫu DTO](#mau-dto)
6. [Thiết lập Cấu hình](#thiet-lap-cau-hinh)
7. [Hướng dẫn Phong cách Code](#huong-dan-phong-cach-code)

## Kiến trúc Đa mô-đun

Mỗi tính năng được đóng gói trong một mô-đun riêng với ranh giới rõ ràng:

```
src/modules/
├── auth/              # Xác thực & phân quyền
├── student-ids/       # Quản lý mã số sinh viên
└── (các mô-đun tương lai)   # Người dùng, vai trò, thông báo, v.v.
```

## Cấu trúc Mô-đun

### Tổ chức Mô-đun Chuẩn

```
src/modules/your-module/
├── constants/
│   ├── your-module.constants.ts      # Hằng số lỗi & thông báo thành công
│   └── your-module-doc.constants.ts  # Decorator tài liệu Swagger
├── domain/
│   └── your-entity.ts                # Thực thể domain (logic nghiệp vụ)
├── dto/
│   ├── create-your-entity.dto.ts     # DTO tạo mới với validation
│   ├── update-your-entity.dto.ts     # DTO cập nhật (partial)
│   └── your-entity-response.dto.ts   # DTO phản hồi
├── infrastructure/
│   ├── entities/
│   │   └── your-entity.entity.ts     # Thực thể cơ sở dữ liệu (TypeORM)
│   ├── mappers/
│   │   └── your-entity.mapper.ts     # Chuyển đổi Domain ↔ Infrastructure
│   └── repositories/
│       ├── your-entity.repository.ts # Interface repository trừu tượng
│       └── your-entity-relational.repository.ts # Triển khai TypeORM
├── your-module.controller.ts         # Endpoint HTTP
├── your-module.service.ts            # Logic nghiệp vụ
└── your-module.module.ts             # Định nghĩa mô-đun
```

### Tạo Mô-đun Mới

1. **Sinh cấu trúc mô-đun**
2. **Tuân theo cấu trúc thư mục như trên**
3. **Tạo hằng số, DTO và tầng hạ tầng**
4. **Đăng ký với `AppModule` nếu cần**

---

## Mẫu Xử lý Lỗi

### 1. Định nghĩa Hằng số Lỗi

**Tạo `constants/your-module.constants.ts`:**

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

### 2. Sử dụng trong Service

**❌ Không nên:**
```typescript
throw new NotFoundException(`Entity ${id} not found`);
throw new ConflictException('Entity already exists');
```

**✅ Nên:**
```typescript
throw AuthExceptions.UserAlreadyExistsException();
```

---

## Quy ước Controller

### 1. Controller KHÔNG kiểm tra dữ liệu

Controller phải gọn nhẹ và ủy quyền toàn bộ cho service. **Không viết validation trong controller.**

**❌ Không nên:**
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

**✅ Nên:**
```typescript
@Post()
@EntityDoc.CreateSummary()
@EntityDoc.CreateSuccess()
@EntityDoc.CreateBadRequest()
@EntityDoc.CreateConflict()
async create(@Body() dto: CreateEntityDto): Promise<EntityResponseDto> {
  return this.service.create(dto); // chỉ trả về dữ liệu cần thiết
}
```

### 2. Controller nên trả về gì

Controller trả về **đối tượng dữ liệu thuần**. `ResponseInterceptor` sẽ tự gói theo chuẩn `ApiResponse`.

**✅ Mẫu trả về:**
```typescript
// Một thực thể
return entityResponseDto;

// Thông báo đơn giản
return { message: SUCCESS_MESSAGES.ENTITY_CREATED };

// Không trả nội dung (204 No Content)
return; // hoặc Promise<void>
```

**❌ Không tự bọc phản hồi:**
```typescript
return {
  success: true,
  data: entity,
  meta: { timestamp: new Date() }
}; // ResponseInterceptor đã xử lý phần này
```

### 3. Dùng Decorator Tài liệu

**Tạo decorator tái sử dụng tại `constants/your-module-doc.constants.ts`:**

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

**Áp dụng trong controller:**
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

### 4. Mã trạng thái HTTP

Sử dụng đúng mã trạng thái:

- **200 OK** - GET, PUT, PATCH thành công
- **201 Created** - POST thành công
- **204 No Content** - DELETE thành công
- **400 Bad Request** - Lỗi validation
- **401 Unauthorized** - Yêu cầu đăng nhập
- **403 Forbidden** - Không đủ quyền
- **404 Not Found** - Không tìm thấy tài nguyên
- **409 Conflict** - Tài nguyên đã tồn tại
- **500 Internal Server Error** - Lỗi không mong muốn

---

## Mẫu Tầng Service

### 1. Vai trò của Service

Service chứa **logic nghiệp vụ** và điều phối giữa các repository:

```typescript
@Injectable()
export class YourEntityService {
  constructor(
    private readonly repository: YourEntityRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateEntityDto): Promise<EntityResponseDto> {
    // Kiểm tra quy tắc nghiệp vụ
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw YOUR_MODULE_ERRORS.ENTITY_ALREADY_EXISTS;
    }

    // Xử lý nghiệp vụ
    const entity = await this.repository.create({
      ...dto,
      slug: this.generateSlug(dto.name),
      status: 'active',
    });

    // Trả về DTO phản hồi
    return this.toResponseDto(entity);
  }

  private generateSlug(name: string): string {
    // Hàm hỗ trợ nghiệp vụ
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  private toResponseDto(entity: YourEntity): EntityResponseDto {
    // Logic mapping
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

### 2. Quy ước đặt tên Service

- Dùng **tên mô tả**: `findById`, `findByEmail`, `createUser`, `updatePassword`
- Dùng **async/await** cho mọi thao tác bất đồng bộ
- Trả về **DTO**, không trả trực tiếp domain entity
- Giữ phương thức **tập trung** và **một trách nhiệm**

### 3. Xử lý lỗi trong Service

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

## Mẫu DTO

### 1. DTO tạo mới với Validation

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

### 2. DTO cập nhật

**`dto/update-your-entity.dto.ts`:**

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateYourEntityDto } from './create-your-entity.dto';

export class UpdateYourEntityDto extends PartialType(CreateYourEntityDto) {}
```

### 3. DTO phản hồi

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

### 4. Quy tắc validation cho DTO

**Luôn cung cấp context tùy chỉnh cho validation:**

```typescript
// ✅ Tốt - có context lỗi rõ ràng
@IsNotEmpty({ context: ERRORS.ALEM01 })
@IsEmail({}, { context: ERRORS.EMAIL01 })

// ❌ Không tốt - thiếu context (sẽ hiện cảnh báo cho developer)
@IsNotEmpty()
@IsEmail()
```

**Chọn validator phù hợp:**

- `@IsNotEmpty()` - Trường bắt buộc
- `@IsOptional()` - Trường tùy chọn
- `@IsString()`, `@IsInt()`, `@IsEmail()` - Kiểm tra kiểu
- `@MinLength()`, `@MaxLength()` - Độ dài chuỗi
- `@Min()`, `@Max()` - Khoảng giá trị số
- `@Matches()` - Theo biểu thức chính quy
- `@Transform()` - Biến đổi dữ liệu

---

## Thiết lập Cấu hình

### 1. Tạo cấu hình mô-đun

Khi mô-đun cần cấu hình riêng, làm theo mẫu sau:

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

### 2. Đăng ký cấu hình

**Thêm vào `app.module.ts`:**

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

### 3. Sử dụng cấu hình trong Service

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
    // Sử dụng config.apiKey, config.timeout, v.v.
  }
}
```

---

## Hướng dẫn Phong cách Code

### 1. Quy ước đặt tên

**File và thư mục:**
- Dùng **kebab-case**: `user-profile.service.ts`, `auth-login.dto.ts`
- Tên mô tả: `student-id-response.dto.ts` thay vì `response.dto.ts`

**Class:**
- Dùng **PascalCase**: `UserProfileService`, `AuthLoginDto`
- Thêm hậu tố theo loại: `Service`, `Controller`, `Module`, `Entity`, `Dto`

**Phương thức và biến:**
- Dùng **camelCase**: `findUserById`, `createNewAccount`
- Tên mô tả: `isPasswordValid` thay vì `isValid`

**Hằng số:**
- Dùng **SCREAMING_SNAKE_CASE**: `USER_ALREADY_EXISTS`, `MAX_LOGIN_ATTEMPTS`

### 2. Tổ chức import

```typescript
// 1. Thư viện Node
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 2. Module nội bộ (đường dẫn tuyệt đối)
import { BusinessException } from '@/common/exceptions';
import { UserRepository } from '@/modules/users/infrastructure/repositories';

// 3. Import tương đối (cùng mô-đun)
import { CreateUserDto } from './dto/create-user.dto';
import { USER_ERRORS } from './constants/user.constants';
```

### 3. Tổ chức phương thức

```typescript
@Injectable()
export class YourService {
  // 1. Constructor
  constructor(private readonly repository: YourRepository) {}

  // 2. Hàm public (theo bảng chữ cái)
  async create(dto: CreateDto): Promise<ResponseDto> {}
  async delete(id: string): Promise<void> {}
  async findById(id: string): Promise<ResponseDto> {}
  async update(id: string, dto: UpdateDto): Promise<ResponseDto> {}

  // 3. Hàm private (theo bảng chữ cái)
  private generateSlug(name: string): string {}
  private toResponseDto(entity: Entity): ResponseDto {}
  private validateBusinessRules(data: any): void {}
}
```

### 4. Thực hành xử lý lỗi

```typescript
// ✅ Tốt - lỗi cụ thể, dễ hành động
throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
throw USER_ERRORS.INVALID_PASSWORD_FORMAT;

// ❌ Không tốt - lỗi chung chung
throw new Error('Something went wrong');
throw new BadRequestException('Invalid data');
```

### 5. Sử dụng Async/Await

```typescript
// ✅ Tốt
async create(dto: CreateDto): Promise<ResponseDto> {
  const existing = await this.repository.findByEmail(dto.email);
  if (existing) {
    throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
  }
  return await this.repository.create(dto);
}

// ❌ Không tốt - trộn promise và async/await
async create(dto: CreateDto): Promise<ResponseDto> {
  return this.repository.findByEmail(dto.email)
    .then(existing => {
      if (existing) throw USER_ERRORS.EMAIL_ALREADY_EXISTS;
      return this.repository.create(dto);
    });
}
```

---

## Bảng kiểm Tóm tắt

Khi tạo mô-đun mới, hãy đảm bảo:

- [ ] **Cấu trúc thư mục chuẩn** (domain, dto, infrastructure, constants)
- [ ] **Hằng số lỗi định nghĩa sẵn** với mã trạng thái phù hợp
- [ ] **Controller sạch** (không validation, dùng decorator tài liệu)
- [ ] **Logic nghiệp vụ trong service** (xử lý lỗi, chuyển đổi dữ liệu)
- [ ] **DTO có context validation** (context lỗi tùy chỉnh)
- [ ] **Decorator tài liệu** cho Swagger
- [ ] **Thiết lập cấu hình** (khi cần)
- [ ] **DTO phản hồi** (không trả domain entity)
- [ ] **Đặt tên & tổ chức import nhất quán**

Hướng dẫn này đảm bảo tính nhất quán cho mọi mô-đun và giúp lập trình viên mới nhanh chóng đóng góp hiệu quả vào codebase.
