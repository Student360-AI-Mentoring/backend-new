# Overview

Thư mục này chứa bộ tài liệu toàn diện cho **ứng dụng NestJS đa mô-đun**. Mỗi tài liệu phục vụ một mục đích cụ thể giúp lập trình viên hiểu và đóng góp hiệu quả vào codebase.

## 📚 Cấu trúc Tài liệu

**Hãy bắt đầu tại đây nếu bạn mới tham gia dự án:**

1. **[Dev guide](developer-guide.md)** - Tổng hợp quy ước, mẫu và thực hành tốt nhất
   - Cấu trúc và tổ chức mô-đun
   - Mẫu xử lý lỗi (lỗi được định nghĩa sẵn)
   - Quy ước controller và service
   - Mẫu DTO và validation
   - Quy ước viết tài liệu
   - Hướng dẫn kiểm thử

2. **[Hướng dẫn Pipeline](request-pipeline.md)** - Toàn bộ pipeline request/response
   - Middleware, pipe, interceptor, filter
   - Luồng xử lý lỗi
   - Định dạng phản hồi
   - Lưu ý về bảo mật và hiệu năng

3. **[Tài liệu cli](cmd-guideline.md)** - Tổng hợp nhanh các lệnh thường dùng
   - Migration cơ sở dữ liệu (tạo, chạy, hoàn tác)
   - Tạo dữ liệu mẫu
   - Công cụ đảm bảo chất lượng code (linting, formatting, testing)
   - Git hook và quy ước commit

4. **[Test API](api-testing.md)** - Tài liệu kiểm thử đầy đủ
   - Cách sử dụng Swagger UI
   - Tài liệu các endpoint hiện có
   - Ví dụ curl và mẫu xác thực
   - Thực hành tốt nhất khi kiểm thử

5. **[Hướng dẫn Cấu hình Ứng dụng](app-config.md)** - Thiết lập và mẫu cấu hình
   - Biến môi trường
   - Mẫu cấu hình mô-đun
   - Cách sử dụng cấu hình type-safe

## 🎯 Best Practice

1. **Đọc trước khi code** - Hiểu mẫu trước khi triển khai
2. **Tuân thủ quy ước** - Tính nhất quán là chìa khóa cho khả năng bảo trì
3. **Cập nhật kiểm thử** - Giữ mẫu kiểm thử đồng bộ với tài liệu
4. **Ghi lại thay đổi** - Cập nhật tài liệu liên quan khi thay đổi kiến trúc
5. **Đặt câu hỏi** - Nếu tài liệu chưa rõ ràng, hãy đề xuất cải thiện

---

**💡 Mẹo**: Hãy đánh dấu README này và Hướng dẫn Nhà phát triển để tham khảo nhanh khi làm việc!
