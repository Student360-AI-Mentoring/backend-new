# Tài liệu Lệnh Tham chiếu

Hướng dẫn tham khảo nhanh các lệnh và tình huống phát triển thường gặp.

## Migration Cơ sở dữ liệu

| Kịch bản | Lệnh | Khi sử dụng |
| --- | --- | --- |
| Tạo migration sau khi đổi entity | `npm run migration:generate -- src/database/migrations/<MigrationName>` | Sau khi thêm/thay đổi entity TypeORM |
| Kiểm tra migration vừa tạo | Mở file mới ở `src/database/migrations/` | Luôn rà soát trước khi chạy migration |
| Chạy các migration đang chờ | `npm run migration:run` | Triển khai thay đổi schema lên cơ sở dữ liệu |
| Hoàn tác migration gần nhất | `npm run migration:revert` | Khi migration gây lỗi |
| Xem migration nào còn chờ | `npm run migration:show` | Kiểm tra trạng thái migration |
| Tạo migration trống | `npm run migration:create -- src/database/migrations/<MigrationName>` | Cho SQL tùy biến hoặc migration dữ liệu |

## Seed Dữ liệu

| Kịch bản | Lệnh | Khi sử dụng |
| --- | --- | --- |
| Chạy script seed | `npm run migration:seed` | Đổ dữ liệu khởi tạo/kiểm thử vào cơ sở dữ liệu |
| Điểm vào seed | `src/database/seeds/run-seeds.ts` | Chỉnh sửa hoặc bổ sung dữ liệu seed |

## Lệnh Build & Khởi chạy

| Kịch bản | Lệnh | Khi sử dụng |
| --- | --- | --- |
| Build dự án cho production | `npm run build` | Trước khi deploy, sau thay đổi lớn |
| Khởi chạy ứng dụng (production) | `npm start` | Khởi động nhanh không hot reload |
| Khởi chạy với hot reload (development) | `npm run start:dev` | Công việc phát triển hằng ngày |
| Khởi chạy kèm debug | `npm run start:debug` | Khi cần gỡ lỗi |
| Chạy bản build production | `npm run start:prod` | Kiểm tra bản build production tại chỗ |

## Chất lượng Code & Kiểm thử

| Kịch bản | Lệnh | Khi sử dụng |
| --- | --- | --- |
| Lint dự án (sửa lỗi tự động) | `npm run lint` | Trước khi commit, sau khi chỉnh code |
| Định dạng code bằng Prettier | `npm run format` | Trước khi commit, đảm bảo định dạng chuẩn |
| Chạy toàn bộ unit test | `npm test` | Kiểm thử định kỳ, trong CI/CD |
| Chạy test ở chế độ in-band | `npm test -- --runInBand --passWithNoTests` | Khi test fail do chạy song song |
| Theo dõi test khi code thay đổi | `npm run test:watch` | Trong quá trình viết test |
| Tạo báo cáo coverage | `npm run test:cov` | Kiểm tra chỉ số bao phủ kiểm thử |
| Debug test | `npm run test:debug` | Khi cần gỡ lỗi test bị fail |
| Chạy end-to-end test | `npm run test:e2e` | Trước khi deploy, kiểm thử tích hợp |

(Husky chạy Prettier + ESLint trên file đã stage qua `lint-staged`, áp dụng quy ước commit message và thực thi Jest trước khi push.)

## Git Hooks & Quy ước Commit

### Định dạng Commit Message
Tuân theo [Conventional Commits](https://conventionalcommits.org/):
- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Thay đổi tài liệu
- `style:` - Thay đổi phong cách code (định dạng, v.v.)
- `refactor:` - Tái cấu trúc code
- `test:` - Thêm hoặc cập nhật test
- `chore:` - Công việc bảo trì

### Git Hooks
Husky tự chạy các bước kiểm tra sau:
- **Pre-commit**: ESLint + Prettier trên file đã stage
- **Commit-msg**: Kiểm tra định dạng commit message
- **Pre-push**: Chạy toàn bộ test suite

**Khắc phục sự cố:**
- Nếu hook không hoạt động: chạy `npm run prepare`
- Nếu test fail trước khi push: sửa test hoặc dùng `--no-verify` (không khuyến khích)
