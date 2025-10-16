# Hướng dẫn Kiểm thử API

## Bắt đầu Nhanh

Cách dễ nhất để kiểm thử API là thông qua Swagger UI:

1. **Khởi chạy ứng dụng** (xem [README.md](../README.md) chính để biết hướng dẫn thiết lập)
2. **Mở Swagger UI** tại `http://localhost:3000/docs`
3. **Thử nghiệm các endpoint** trực tiếp trong giao diện trình duyệt

## Endpoint Hiện có

### Mô-đun Xác thực
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập người dùng
- `POST /api/auth/refresh` - Làm mới token JWT

### Mô-đun Student IDs
- `GET /api/student-ids` - Liệt kê toàn bộ student ID
- `POST /api/student-ids` - Tạo student ID mới
- `GET /api/student-ids/{id}` - Lấy student ID theo ID
- `PUT /api/student-ids/{id}` - Cập nhật student ID
- `DELETE /api/student-ids/{id}` - Xóa student ID

### Mô-đun Jobs
- `GET /api/jobs` - Liệt kê job đang hoạt động kèm thông tin công ty, danh mục, địa điểm
  - Query hỗ trợ: `page`, `limit`, `search`, `companyId`, `categoryId`, `locationId`, `employmentType`, `experienceLevel`, `isActive`

## Sử dụng Swagger UI

### Quy trình kiểm thử:
1. **Đăng ký/Đăng nhập** để lấy token xác thực
2. **Ủy quyền** bằng nút `Authorize` trong Swagger UI
3. **Thử nghiệm endpoint bảo vệ** với token được tự động gắn vào

### Định dạng phản hồi:
Mọi phản hồi API đều tuân theo định dạng chuẩn sau:
```json
{
  "success": true,
  "status": 200,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-01T00:00:00.000Z",
    "request_id": "req-123456"
  }
}
```

## Phương thức kiểm thử thay thế

### Sử dụng curl
Nếu bạn thích kiểm thử bằng dòng lệnh, đây là một số ví dụ cơ bản:

**Đăng ký:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Đăng nhập:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Request có xác thực:**
```bash
# Thay YOUR_JWT_TOKEN bằng token nhận được sau khi đăng nhập
curl -X GET http://localhost:3000/api/student-ids \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Sử dụng Postman/Insomnia
1. Import collection API từ Swagger UI
2. Cấu hình biến môi trường cho base URL và token
3. Dùng collection runner để kiểm thử tự động

## Thực hành Kiểm thử Tốt nhất

1. **Bắt đầu bằng xác thực** - Hầu hết endpoint yêu cầu token JWT hợp lệ
2. **Kiểm tra định dạng phản hồi** - Đảm bảo mọi phản hồi theo đúng mẫu
3. **Kiểm thử tình huống lỗi** - Thử dữ liệu không hợp lệ để kiểm tra xử lý lỗi
4. **Dùng Request ID** - Mỗi phản hồi đều có request_id duy nhất phục vụ debug
5. **Theo dõi log** - Xem log ứng dụng để biết chi tiết request/response

Để xem chi tiết tài liệu endpoint, schema và ví dụ phản hồi, hãy sử dụng Swagger UI tại `/docs`.
