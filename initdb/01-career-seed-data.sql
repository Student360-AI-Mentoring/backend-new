-- ================================================
-- REALISTIC DATA FOR VIETNAM STUDENT JOB PLATFORM
-- ================================================

-- National Student IDs (Real Vietnamese universities and majors)
INSERT INTO national_student_ids (id, full_name, date_of_birth, university, major, enrollment_year, graduation_year,
                                  created_at, updated_at)
VALUES ('NS001', 'Nguyễn Văn An', '2002-03-15', 'Đại học Bách Khoa TP.HCM', 'Khoa học máy tính', 2020, 2024, NOW(),
        NOW()),
       ('NS002', 'Trần Thị Bình', '2003-07-22', 'Đại học Quốc gia Hà Nội', 'Công nghệ thông tin', 2021, 2025, NOW(),
        NOW()),
       ('NS003', 'Lê Hoàng Cường', '2002-11-08', 'Đại học Kinh tế TP.HCM', 'Quản trị kinh doanh', 2020, 2024, NOW(),
        NOW()),
       ('NS004', 'Phạm Minh Đức', '2001-05-30', 'Đại học Bách Khoa Hà Nội', 'Kỹ thuật phần mềm', 2019, 2023, NOW(),
        NOW()),
       ('NS005', 'Hoàng Thị Em', '2003-01-18', 'Đại học Bách Khoa Đà Nẵng', 'Kỹ thuật máy tính', 2021, 2025, NOW(),
        NOW()),
       ('NS006', 'Võ Anh Tuấn', '2002-09-25', 'Đại học Cần Thơ', 'Hệ thống thông tin', 2020, 2024, NOW(), NOW()),
       ('NS007', 'Đặng Thanh Hằng', '2003-04-12', 'Đại học Huế', 'Công nghệ phần mềm', 2021, 2025, NOW(), NOW()),
       ('NS008', 'Bùi Thị Linh', '2001-12-30', 'Đại học FPT', 'Trí tuệ nhân tạo', 2019, 2023, NOW(), NOW()),
       ('NS009', 'Ngô Minh Quân', '2002-08-08', 'Đại học RMIT Việt Nam', 'Thiết kế UI/UX', 2020, 2024, NOW(), NOW()),
       ('NS010', 'Trương Thị Nga', '2003-02-14', 'Đại học Bưu chính Viễn thông', 'An toàn thông tin', 2021, 2025, NOW(),
        NOW());

INSERT INTO national_student_ids (id, full_name, date_of_birth, university, major, enrollment_year, graduation_year,
                                  created_at, updated_at)
VALUES ('NS011', 'Phan Văn Hải', '2002-06-20', 'Đại học Tôn Đức Thắng', 'Khoa học dữ liệu', 2020, 2024, NOW(), NOW()),
       ('NS012', 'Đinh Thị Mai', '2001-10-05', 'Đại học Ngoại thương', 'Marketing', 2019, 2023, NOW(), NOW()),
       ('NS013', 'Lý Minh Thành', '2003-03-28', 'Đại học Công nghệ TP.HCM', 'Kỹ thuật phần mềm', 2021, 2025, NOW(),
        NOW()),
       ('NS014', 'Hồ Thị Thu', '2002-12-15', 'Đại học Sư phạm TP.HCM', 'Công nghệ giáo dục', 2020, 2024, NOW(), NOW()),
       ('NS015', 'Trịnh Văn Tùng', '2001-07-09', 'Đại học Đà Nẵng', 'Mạng máy tính', 2019, 2023, NOW(), NOW());

INSERT INTO national_student_ids
  (id, full_name, date_of_birth, university, major,
   enrollment_year, graduation_year, created_at, updated_at)
SELECT
  'NS' || LPAD(g::text, 3, '0') AS id,                 -- NS001…NS120
  'Sinh viên ' || g          AS full_name,
  (DATE '1998-01-01' + ((g * 13) % 800) * INTERVAL '1 day')::date AS date_of_birth,
  'Đại học Quốc gia Việt Nam ' || ((g % 6) + 1)       AS university,
  'Chuyên ngành ' || ((g % 12) + 1)                   AS major,
  2018 + (g % 4)                                      AS enrollment_year,
  2022 + (g % 4)                                      AS graduation_year,
  NOW(), NOW()
FROM generate_series(16, 120) AS g;

-- Account Types
INSERT INTO account_types (id, name, description)
VALUES (1, 'Sinh viên', 'Tài khoản sinh viên tìm kiếm việc làm'),
       (2, 'Nhà tuyển dụng', 'Tài khoản công ty đăng tin tuyển dụng'),
       (3, 'Quản trị viên công ty', 'Quản lý toàn bộ hoạt động tuyển dụng của công ty'),
       (4, 'Quản trị viên trường', 'Quản lý hồ sơ sinh viên và kết nối doanh nghiệp'),
       (5, 'Tư vấn nghề nghiệp', 'Hỗ trợ định hướng nghề nghiệp cho sinh viên'),
       (6, 'Quản trị hệ thống', 'Quản lý toàn bộ hệ thống'),
       (7, 'Cựu sinh viên', 'Alumni với tính năng networking và mentor'),
       (8, 'Headhunter', 'Chuyên viên săn đầu người với công cụ tìm kiếm nâng cao');

-- Accounts
INSERT INTO accounts (id, national_student_id, external_id, account_type_id, email, password_hash, is_active,
                      is_verified, created_at, updated_at)
VALUES ('acc_001', 'NS001', NULL, 1, 'nguyenvanan@gmail.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jO', TRUE, TRUE, NOW(), NOW()),
       ('acc_002', 'NS002', NULL, 1, 'tranbinhhanu@gmail.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jP', TRUE, TRUE, NOW(), NOW()),
       ('acc_003', 'NS003', NULL, 1, 'lehoangcuong@student.ueh.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jQ', TRUE, TRUE, NOW(), NOW()),
       ('acc_004', 'NS004', NULL, 1, 'phamminhduc@hust.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jR', TRUE, TRUE, NOW(), NOW()),
       ('acc_005', 'NS005', NULL, 1, 'hoangthiem@dut.udn.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jS', TRUE, TRUE, NOW(), NOW()),
       ('acc_006', 'NS006', NULL, 1, 'voanhtuan.ctu@gmail.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jT', TRUE, TRUE, NOW(), NOW()),
       ('acc_007', 'NS007', NULL, 1, 'danghanghue@gmail.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jU', TRUE, TRUE, NOW(), NOW()),
       ('acc_008', 'NS008', NULL, 1, 'buitlinh@fpt.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jV', TRUE, TRUE, NOW(), NOW()),
       ('acc_009', 'NS009', NULL, 1, 'ngominhquan@rmit.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jW', TRUE, TRUE, NOW(), NOW()),
       ('acc_010', 'NS010', NULL, 1, 'truongnga.ptit@gmail.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jX', TRUE, TRUE, NOW(), NOW()),
       ('acc_011', 'NS011', NULL, 1, 'phanvanhai@tdtu.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jY', TRUE, TRUE, NOW(), NOW()),
       ('acc_012', 'NS012', NULL, 1, 'dinhthimai@ftu.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jZ', TRUE, TRUE, NOW(), NOW()),
       ('acc_013', 'NS013', NULL, 1, 'lyminhthanh@hutech.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2j1', TRUE, TRUE, NOW(), NOW()),
       ('acc_014', 'NS014', NULL, 1, 'hothithu@hcmue.edu.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2j2', TRUE, TRUE, NOW(), NOW()),
       ('acc_015', 'NS015', NULL, 1, 'trinhvantung@udn.vn',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2j3', TRUE, TRUE, NOW(), NOW());

INSERT INTO accounts
  (id, national_student_id, external_id, account_type_id, email,
   password_hash, is_active, is_verified, created_at, updated_at)
SELECT
  'acc_' || LPAD(g::text, 3, '0')              AS id,                 -- acc_016…
  'NS'   || LPAD(g::text, 3, '0')              AS national_student_id, -- NS016…
  'ext_' || LPAD(g::text, 3, '0')              AS external_id,         -- ext_016…
  1                                           AS account_type_id,
  'student' || LPAD(g::text, 3, '0') || '@student360.vn' AS email,    -- student016@student360.vn
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jO'     AS password_hash,
  TRUE                                         AS is_active,
  (g % 2) = 0                                  AS is_verified,
  NOW(), NOW()
FROM generate_series(16, 120) AS g;

-- Students
INSERT INTO students (id, account_id, national_student_id, current_year, gpa, created_at, updated_at)
VALUES (1, 'acc_001', 'NS001', 4, 3.65, NOW(), NOW()),
       (2, 'acc_002', 'NS002', 3, 3.82, NOW(), NOW()),
       (3, 'acc_003', 'NS003', 4, 3.45, NOW(), NOW()),
       (4, 'acc_004', 'NS004', 4, 3.91, NOW(), NOW()),
       (5, 'acc_005', 'NS005', 3, 3.58, NOW(), NOW()),
       (6, 'acc_006', 'NS006', 4, 3.72, NOW(), NOW()),
       (7, 'acc_007', 'NS007', 3, 3.68, NOW(), NOW()),
       (8, 'acc_008', 'NS008', 4, 3.95, NOW(), NOW()),
       (9, 'acc_009', 'NS009', 4, 3.55, NOW(), NOW()),
       (10, 'acc_010', 'NS010', 3, 3.78, NOW(), NOW()),
       (11, 'acc_011', 'NS011', 4, 3.62, NOW(), NOW()),
       (12, 'acc_012', 'NS012', 4, 3.48, NOW(), NOW()),
       (13, 'acc_013', 'NS013', 3, 3.75, NOW(), NOW()),
       (14, 'acc_014', 'NS014', 4, 3.52, NOW(), NOW()),
       (15, 'acc_015', 'NS015', 4, 3.88, NOW(), NOW());

INSERT INTO students
  (id, account_id, national_student_id, current_year, gpa, created_at, updated_at)
SELECT
  g                                              AS id,
  'acc_' || LPAD(g::text, 3, '0')                AS account_id,
  'NS'   || LPAD(g::text, 3, '0')                AS national_student_id,
  (g % 4) + 1                                    AS current_year,
  ROUND(((g % 31) + 25)::numeric / 10, 2)        AS gpa,
  NOW(), NOW()
FROM generate_series(16, 120) AS g;

-- Skills (Real tech skills in Vietnam market)
INSERT INTO skills (id, name, category, description, created_by, updated_by, created_at, updated_at)
VALUES (1, 'Java', 'Backend', 'Lập trình backend với Spring Boot', 'acc_001', 'acc_001', NOW(), NOW()),
       (2, 'ReactJS', 'Frontend', 'Phát triển giao diện người dùng với React', 'acc_001', 'acc_001', NOW(), NOW()),
       (3, 'NodeJS', 'Backend', 'Backend development với Node.js và Express', 'acc_002', 'acc_002', NOW(), NOW()),
       (4, 'Python', 'Backend', 'Django, Flask, FastAPI và Data Science', 'acc_003', 'acc_003', NOW(), NOW()),
       (5, 'Angular', 'Frontend', 'Framework frontend của Google', 'acc_004', 'acc_004', NOW(), NOW()),
       (6, 'Vue.js', 'Frontend', 'Progressive JavaScript framework', 'acc_005', 'acc_005', NOW(), NOW()),
       (7, 'PostgreSQL', 'Database', 'Quản trị cơ sở dữ liệu quan hệ', 'acc_006', 'acc_006', NOW(), NOW()),
       (8, 'MongoDB', 'Database', 'NoSQL database', 'acc_007', 'acc_007', NOW(), NOW()),
       (9, 'Docker', 'DevOps', 'Containerization và deployment', 'acc_008', 'acc_008', NOW(), NOW()),
       (10, 'Kubernetes', 'DevOps', 'Container orchestration', 'acc_009', 'acc_009', NOW(), NOW()),
       (11, 'AWS', 'Cloud', 'Amazon Web Services', 'acc_010', 'acc_010', NOW(), NOW()),
       (12, 'Azure', 'Cloud', 'Microsoft Azure cloud platform', 'acc_001', 'acc_001', NOW(), NOW()),
       (13, 'Machine Learning', 'AI/ML', 'TensorFlow, PyTorch, Scikit-learn', 'acc_002', 'acc_002', NOW(), NOW()),
       (14, 'Flutter', 'Mobile', 'Cross-platform mobile development', 'acc_003', 'acc_003', NOW(), NOW()),
       (15, 'React Native', 'Mobile', 'Mobile app development với React', 'acc_004', 'acc_004', NOW(), NOW()),
       (16, 'TypeScript', 'Programming', 'Strongly typed JavaScript', 'acc_005', 'acc_005', NOW(), NOW()),
       (17, 'Golang', 'Backend', 'Go programming language', 'acc_006', 'acc_006', NOW(), NOW()),
       (18, 'C#/.NET', 'Backend', 'Microsoft technology stack', 'acc_007', 'acc_007', NOW(), NOW()),
       (19, 'UI/UX Design', 'Design', 'Figma, Adobe XD, Sketch', 'acc_009', 'acc_009', NOW(), NOW()),
       (20, 'SEO/SEM', 'Marketing', 'Search Engine Optimization & Marketing', 'acc_012', 'acc_012', NOW(), NOW());

-- Industries
INSERT INTO industries (id, name, description)
VALUES (1, 'Công nghệ thông tin', 'Phần mềm, phần cứng, dịch vụ IT'),
       (2, 'Tài chính - Ngân hàng', 'Ngân hàng, đầu tư, bảo hiểm'),
       (3, 'Thương mại điện tử', 'Sàn TMĐT, logistics, fintech'),
       (4, 'Giáo dục - Đào tạo', 'Edtech, trường học, đào tạo trực tuyến'),
       (5, 'Game & Entertainment', 'Game development, giải trí số'),
       (6, 'Tư vấn quản lý', 'Tư vấn chiến lược, digital transformation'),
       (7, 'Y tế - Chăm sóc sức khỏe', 'Healthtech, bệnh viện, dược phẩm'),
       (8, 'Bất động sản - Xây dựng', 'Proptech, quản lý BĐS, xây dựng'),
       (9, 'Truyền thông - Marketing', 'Agency, PR, content creation'),
       (10, 'Outsourcing', 'Gia công phần mềm, offshore development');

-- Companies (Real Vietnamese and international companies)
INSERT INTO companies (id, name, description, website, industry_id, size, contact_email, logo_url, address, created_at,
                       updated_at)
VALUES (1, 'FPT Software',
        'Công ty phần mềm hàng đầu Việt Nam với 30.000+ nhân sự, cung cấp dịch vụ chuyển đổi số cho khách hàng toàn cầu',
        'https://fptsoftware.com', 1, 30000, 'careers@fpt.com', 'https://cdn.fpt.com/logo.png',
        'FPT Building, Tân Thuận, Quận 7, TP.HCM', NOW(), NOW()),
       (2, 'VNG Corporation', 'Tập đoàn công nghệ hàng đầu Việt Nam, sở hữu Zalo, ZaloPay, game online',
        'https://www.vng.com.vn', 1, 5000, 'recruitment@vng.com.vn', 'https://cdn.vng.com/logo.png',
        'Z06 Building, Tân Thuận, Quận 7, TP.HCM', NOW(), NOW()),
       (3, 'Viettel Solutions', 'Công ty công nghệ thông tin của Tập đoàn Viettel, chuyên về giải pháp chuyển đổi số',
        'https://viettelsolutions.vn', 1, 3000, 'tuyendung@viettelsolutions.vn', 'https://cdn.viettel.com/logo.png',
        'Tòa nhà Viettel, Quận Cầu Giấy, Hà Nội', NOW(), NOW()),
       (4, 'Tiki', 'Sàn thương mại điện tử lớn nhất Việt Nam với 20 triệu người dùng', 'https://tiki.vn', 3, 2000,
        'jobs@tiki.vn', 'https://cdn.tiki.vn/logo.png', 'Tòa nhà 52 Út Tịch, Quận Tân Bình, TP.HCM', NOW(), NOW()),
       (5, 'Shopee Vietnam', 'Nền tảng thương mại điện tử và fintech hàng đầu Đông Nam Á', 'https://shopee.vn', 3, 8000,
        'careers.vn@shopee.com', 'https://cdn.shopee.vn/logo.png', 'Tòa nhà Flemington, Quận 11, TP.HCM', NOW(), NOW()),
       (6, 'Momo', 'Ví điện tử số 1 Việt Nam với 30 triệu người dùng', 'https://momo.vn', 2, 1500, 'careers@momo.vn',
        'https://cdn.momo.vn/logo.png', 'Phú Mỹ Hưng, Quận 7, TP.HCM', NOW(), NOW()),
       (7, 'VNPAY', 'Cổng thanh toán điện tử hàng đầu Việt Nam', 'https://vnpay.vn', 2, 1000, 'hr@vnpay.vn',
        'https://cdn.vnpay.vn/logo.png', 'Tòa nhà VTP, Láng Hạ, Đống Đa, Hà Nội', NOW(), NOW()),
       (8, 'Gameloft Vietnam', 'Studio phát triển game di động lớn nhất Việt Nam', 'https://www.gameloft.com/vi', 5,
        500, 'recruitment.vietnam@gameloft.com', 'https://cdn.gameloft.com/logo.png',
        'Tòa nhà Flemington Tower, Quận 11, TP.HCM', NOW(), NOW()),
       (9, 'ELSA Corp', 'Ứng dụng học tiếng Anh bằng AI với 40 triệu người dùng toàn cầu', 'https://elsanow.com', 4,
        200, 'jobs@elsanow.com', 'https://cdn.elsa.com/logo.png', 'Bitexco Financial Tower, Quận 1, TP.HCM', NOW(),
        NOW()),
       (10, 'Grab Vietnam', 'Super app hàng đầu Đông Nam Á', 'https://www.grab.com/vn', 3, 3000, 'careers.vn@grab.com',
        'https://cdn.grab.com/logo.png', 'Viettel Complex, Quận 10, TP.HCM', NOW(), NOW()),
       (11, 'NashTech Vietnam', 'Công ty outsourcing thuộc tập đoàn Harvey Nash', 'https://nashtechglobal.com', 10,
        2500, 'recruitment@nashtechglobal.com', 'https://cdn.nashtech.com/logo.png', 'Tòa nhà E.Town, Quận 7, TP.HCM',
        NOW(), NOW()),
       (12, 'KMS Technology', 'Công ty tư vấn và phát triển phần mềm cho thị trường Mỹ', 'https://kms-technology.com',
        1, 1200, 'careers@kms-technology.com', 'https://cdn.kms.com/logo.png', 'Lim Tower, Quận 1, TP.HCM', NOW(),
        NOW()),
       (13, 'Be Group', 'Nền tảng công nghệ đa dịch vụ', 'https://be.com.vn', 3, 1000, 'tuyendung@be.com.vn',
        'https://cdn.be.com/logo.png', 'Toong Coworking, Quận Bình Thạnh, TP.HCM', NOW(), NOW()),
       (14, 'Techcombank', 'Ngân hàng số hàng đầu Việt Nam', 'https://techcombank.com.vn', 2, 10000,
        'careers@techcombank.com.vn', 'https://cdn.techcombank.com/logo.png', 'Tòa nhà Techcombank, Ba Đình, Hà Nội',
        NOW(), NOW()),
       (15, 'Bosch Vietnam', 'Tập đoàn công nghệ đa quốc gia Đức', 'https://www.bosch.com.vn', 1, 3000,
        'contact@vn.bosch.com', 'https://cdn.bosch.com/logo.png', 'Saigon Hi-Tech Park, Quận 9, TP.HCM', NOW(), NOW());

-- Locations (Major Vietnamese cities and districts)
INSERT INTO locations (id, name)
VALUES (1, 'TP. Hồ Chí Minh'),
       (2, 'Hà Nội'),
       (3, 'Đà Nẵng'),
       (4, 'Hải Phòng'),
       (5, 'Cần Thơ'),
       (6, 'Biên Hòa - Đồng Nai'),
       (7, 'Nha Trang - Khánh Hòa'),
       (8, 'Huế'),
       (9, 'Vũng Tàu - Bà Rịa'),
       (10, 'Thủ Đức - TP.HCM');

-- Job Categories
INSERT INTO job_categories (id, parent_id, name, description)
VALUES (1, NULL, 'Lập trình', 'Các vị trí liên quan đến lập trình phần mềm'),
       (2, NULL, 'Thiết kế', 'UI/UX, Graphic Design, Product Design'),
       (3, NULL, 'Kinh doanh', 'Sales, Business Development, Account Manager'),
       (4, NULL, 'Marketing', 'Digital Marketing, Content, SEO/SEM'),
       (5, 1, 'Backend Developer', 'Phát triển phần server-side'),
       (6, 1, 'Frontend Developer', 'Phát triển giao diện người dùng'),
       (7, 1, 'Full Stack Developer', 'Phát triển cả frontend và backend'),
       (8, 1, 'Mobile Developer', 'Phát triển ứng dụng di động'),
       (9, 1, 'DevOps Engineer', 'CI/CD, Infrastructure, Cloud'),
       (10, 1, 'Data Engineer', 'Data pipeline, ETL, Big Data'),
       (11, 1, 'QA/Tester', 'Kiểm thử phần mềm'),
       (12, 2, 'UI/UX Designer', 'Thiết kế trải nghiệm người dùng'),
       (13, 2, 'Graphic Designer', 'Thiết kế đồ họa'),
       (14, 4, 'Digital Marketing', 'Marketing trên các nền tảng số'),
       (15, 4, 'Content Creator', 'Sáng tạo nội dung');

-- Salary Currencies
INSERT INTO salary_currencies (code, name, symbol)
VALUES ('VND', 'Đồng Việt Nam', '₫'),
       ('USD', 'Đô la Mỹ', '$');

-- Jobs (Real job postings in Vietnam)
INSERT INTO jobs (id, company_id, category_id, location_id, title, description, requirements,
                  location, employment_type, experience_level, salary_min, salary_max, salary_currency,
                  application_method, application_url, application_email, apply_count,
                  deadline, is_active, created_by, updated_by, created_at, updated_at)
VALUES (1, 1, 5, 1, 'Backend Developer Intern (Java/Spring Boot)',
        'FPT Software tuyển dụng Backend Developer Intern để tham gia phát triển các dự án lớn cho khách hàng quốc tế. Bạn sẽ được đào tạo và làm việc với công nghệ hiện đại, team quốc tế.',
        '- Sinh viên năm 3, 4 hoặc mới tốt nghiệp ngành CNTT
        - Có kiến thức cơ bản về Java, OOP
        - Có kiến thức về Spring Boot là lợi thế
        - Tiếng Anh đọc hiểu tài liệu
        - Ham học hỏi, chịu được áp lực công việc',
        'Quận 7, TP. Hồ Chí Minh', 'internship', 'internship', 5000000, 8000000, 'VND', 'internal', NULL,
        'careers@fpt.com',
        25, '2025-12-31', TRUE, 'acc_001', 'acc_001', NOW(), NOW()),

       (2, 2, 6, 1, 'Frontend Developer (ReactJS) - Junior',
        'VNG tuyển dụng Frontend Developer để phát triển các sản phẩm như Zalo, ZaloPay. Môi trường làm việc năng động, sáng tạo với mức lương cạnh tranh.',
        '- Tốt nghiệp Đại học chuyên ngành CNTT
        - Tối thiểu 1 năm kinh nghiệm với ReactJS
        - Hiểu biết về HTML5, CSS3, JavaScript ES6+
        - Có kinh nghiệm với Redux, React Hooks
        - Biết sử dụng Git
        - Khả năng làm việc nhóm tốt',
        'Quận 7, TP. Hồ Chí Minh', 'full_time', 'junior', 15000000, 25000000, 'VND', 'external',
        'https://careers.vng.com.vn', NULL,
        42, '2025-11-30', TRUE, 'acc_002', 'acc_002', NOW(), NOW()),

       (3, 4, 5, 1, 'Backend Engineer (Golang/Python)',
        'Tiki đang tìm kiếm Backend Engineer để xây dựng hệ thống microservices phục vụ hàng triệu người dùng. Join với chúng mình để scale một trong những platform lớn nhất VN!',
        '- 2+ năm kinh nghiệm backend development
        - Thành thạo ít nhất 1 ngôn ngữ: Golang, Python, Java
        - Kinh nghiệm với microservices, Docker, Kubernetes
        - Hiểu biết về database (MySQL, PostgreSQL, Redis)
        - Có kinh nghiệm với message queue (Kafka, RabbitMQ)
        - Kinh nghiệm xử lý high traffic là một lợi thế',
        'Quận Tân Bình, TP. Hồ Chí Minh', 'full_time', 'middle', 25000000, 40000000, 'VND', 'internal', NULL,
        'jobs@tiki.vn',
        68, '2025-12-20', TRUE, 'acc_003', 'acc_003', NOW(), NOW()),

       (4, 5, 7, 1, 'Full Stack Developer (NodeJS + React)',
        'Shopee Vietnam tuyển dụng Full Stack Developer để phát triển các tính năng mới cho platform. Làm việc với công nghệ hiện đại, team quốc tế, nhiều cơ hội thăng tiến.',
        '- 1-2 năm kinh nghiệm Full Stack development
        - Thành thạo NodeJS (Express/NestJS) và ReactJS
        - Kinh nghiệm với TypeScript
        - Hiểu biết về RESTful API, GraphQL
        - Kinh nghiệm với MongoDB hoặc PostgreSQL
        - Có khả năng làm việc độc lập và theo team
        - Tiếng Anh giao tiếp tốt',
        'Quận 11, TP. Hồ Chí Minh', 'full_time', 'junior', 20000000, 35000000, 'VND', 'external',
        'https://careers.shopee.vn/jobs', NULL,
        95, '2025-11-25', TRUE, 'acc_004', 'acc_004', NOW(), NOW()),

       (5, 6, 5, 1, 'Backend Developer (Java Spring Boot) - Senior',
        'Momo tuyển dụng Senior Backend Developer để phát triển hệ thống thanh toán phục vụ 30 triệu người dùng. Thử thách với high performance, high availability systems.',
        '- 3+ năm kinh nghiệm với Java, Spring Boot
        - Kinh nghiệm thiết kế và phát triển microservices
        - Thành thạo MySQL, Redis, Kafka
        - Hiểu biết về payment systems là một lợi thế lớn
        - Kinh nghiệm với AWS/GCP
        - Có khả năng mentoring junior developers
        - Tư duy hệ thống tốt, giải quyết vấn đề hiệu quả',
        'Quận 7, TP. Hồ Chí Minh', 'full_time', 'senior', 35000000, 55000000, 'VND', 'internal', NULL,
        'careers@momo.vn',
        52, '2026-01-15', TRUE, 'acc_005', 'acc_005', NOW(), NOW()),

       (6, 8, 8, 1, 'Unity Game Developer',
        'Gameloft tuyển dụng Unity Developer để phát triển game mobile top charts. Làm việc trong môi trường sáng tạo, team quốc tế, được tiếp cận game engine và công nghệ mới nhất.',
        '- 1+ năm kinh nghiệm với Unity 3D
        - Thành thạo C# programming
        - Hiểu biết về game physics, animation
        - Có portfolio game projects
        - Đam mê game, cập nhật xu hướng gaming
        - Có kinh nghiệm với multiplayer/networking là lợi thế',
        'Quận 11, TP. Hồ Chí Minh', 'full_time', 'junior', 18000000, 30000000, 'VND', 'external',
        'https://www.gameloft.com/careers', NULL,
        38, '2025-12-10', TRUE, 'acc_006', 'acc_006', NOW(), NOW()),

       (7, 9, 6, 1, 'Frontend Developer (React Native)',
        'ELSA tuyển dụng React Native Developer để phát triển app học tiếng Anh bằng AI. Sản phẩm của chúng mình đang được sử dụng bởi 40 triệu người trên toàn cầu!',
        '- 1-2 năm kinh nghiệm React Native
        - Thành thạo JavaScript/TypeScript
        - Kinh nghiệm publish app lên App Store/Play Store
        - Hiểu biết về mobile UI/UX best practices
        - Có kinh nghiệm với native modules là lợi thế
        - Tiếng Anh giao tiếp tốt (làm việc với team US)',
        'Quận 1, TP. Hồ Chí Minh', 'full_time', 'junior', 20000000, 32000000, 'VND', 'internal', NULL,
        'jobs@elsanow.com',
        29, '2025-11-20', TRUE, 'acc_007', 'acc_007', NOW(), NOW()),

       (8, 3, 9, 2, 'DevOps Engineer',
        'Viettel Solutions tuyển dụng DevOps Engineer để xây dựng và vận hành hạ tầng cloud cho các dự án chuyển đổi số lớn của chính phủ và doanh nghiệp.',
        '- 2+ năm kinh nghiệm DevOps/SRE
        - Thành thạo Docker, Kubernetes
        - Kinh nghiệm với CI/CD (Jenkins, GitLab CI, GitHub Actions)
        - Hiểu biết về IaC (Terraform, Ansible)
        - Kinh nghiệm với cloud platforms (AWS/Azure/GCP)
        - Có kinh nghiệm monitoring (Prometheus, Grafana, ELK)',
        'Quận Cầu Giấy, Hà Nội', 'full_time', 'middle', 25000000, 45000000, 'VND', 'internal', NULL,
        'tuyendung@viettelsolutions.vn',
        31, '2025-12-25', TRUE, 'acc_008', 'acc_008', NOW(), NOW()),

       (9, 10, 5, 1, 'Backend Engineer (Golang) - Grab Vietnam',
        'Grab đang tìm kiếm Backend Engineer để phát triển các services phục vụ hàng triệu người dùng. Work on challenging problems at scale!',
        '- 2+ năm kinh nghiệm backend development
        - Thành thạo Golang
        - Kinh nghiệm với microservices architecture
        - Hiểu biết sâu về database design và optimization
        - Kinh nghiệm với distributed systems
        - Strong problem-solving skills
        - Tiếng Anh giao tiếp lưu loát',
        'Quận 10, TP. Hồ Chí Minh', 'full_time', 'middle', 30000000, 50000000, 'VND', 'external',
        'https://grab.careers/jobs', NULL,
        87, '2026-01-31', TRUE, 'acc_009', 'acc_009', NOW(), NOW()),

       (10, 12, 12, 1, 'UI/UX Designer',
        'KMS Technology tuyển dụng UI/UX Designer để thiết kế sản phẩm cho khách hàng Mỹ. Remote-friendly, nhiều dự án đa dạng từ healthcare đến fintech.',
        '- 1-2 năm kinh nghiệm UI/UX design
        - Thành thạo Figma, Adobe XD, Sketch
        - Có portfolio showcase design projects
        - Hiểu biết về design thinking, user research
        - Khả năng prototype và presentation tốt
        - Có kinh nghiệm design system là lợi thế
        - Tiếng Anh giao tiếp tốt',
        'Quận 1, TP. Hồ Chí Minh', 'full_time', 'junior', 15000000, 25000000, 'VND', 'internal', NULL,
        'careers@kms-technology.com',
        23, '2025-11-30', TRUE, 'acc_009', 'acc_009', NOW(), NOW()),

       (11, 7, 10, 2, 'Data Engineer',
        'VNPAY tuyển dụng Data Engineer để xây dựng data pipeline phục vụ phân tích và báo cáo cho hệ thống thanh toán. Làm việc với big data, modern data stack.',
        '- 1-2 năm kinh nghiệm Data Engineering
        - Thành thạo Python, SQL
        - Kinh nghiệm với Airflow, Spark, Kafka
        - Hiểu biết về data warehouse (Redshift, BigQuery, Snowflake)
        - Có kinh nghiệm với ETL/ELT processes
        - Hiểu biết về data modeling',
        'Đống Đa, Hà Nội', 'full_time', 'junior', 18000000, 30000000, 'VND', 'internal', NULL, 'hr@vnpay.vn',
        19, '2025-12-15', TRUE, 'acc_010', 'acc_010', NOW(), NOW()),

       (12, 11, 11, 1, 'QA Engineer (Automation)',
        'NashTech tuyển dụng QA Automation Engineer cho các dự án offshore. Làm việc với client UK/US, remote-friendly.',
        '- 1+ năm kinh nghiệm QA/Testing
        - Có kinh nghiệm automation testing (Selenium, Cypress, Playwright)
        - Hiểu biết về testing frameworks (JUnit, TestNG, Jest)
        - Kinh nghiệm với API testing (Postman, RestAssured)
        - Biết code (Java, JavaScript, Python)
        - Có kinh nghiệm CI/CD integration
        - Tiếng Anh tốt',
        'Quận 7, TP. Hồ Chí Minh', 'full_time', 'junior', 15000000, 25000000, 'VND', 'external',
        'https://nashtechglobal.com/careers', NULL,
        34, '2025-11-28', TRUE, 'acc_011', 'acc_011', NOW(), NOW()),

       (13, 13, 8, 1, 'iOS Developer',
        'Be Group tuyển dụng iOS Developer để phát triển app gọi xe, giao đồ ăn. Làm việc với Swift, SwiftUI, modern iOS technologies.',
        '- 1+ năm kinh nghiệm iOS development
        - Thành thạo Swift, UIKit/SwiftUI
        - Hiểu biết về iOS design patterns (MVC, MVVM, Clean Architecture)
        - Kinh nghiệm với RESTful APIs, JSON
        - Có app trên App Store là lợi thế
        - Đam mê mobile development',
        'Quận Bình Thạnh, TP. Hồ Chí Minh', 'full_time', 'junior', 18000000, 30000000, 'VND', 'internal', NULL,
        'tuyendung@be.com.vn',
        27, '2025-12-05', TRUE, 'acc_012', 'acc_012', NOW(), NOW()),

       (14, 14, 5, 2, 'Java Developer (Banking Domain)',
        'Techcombank tuyển dụng Java Developer để phát triển hệ thống ngân hàng số. Môi trường chuyên nghiệp, lương thưởng hấp dẫn, nhiều benefit.',
        '- 2+ năm kinh nghiệm Java/Spring Boot
        - Có kinh nghiệm banking/finance domain là lợi thế lớn
        - Hiểu biết về microservices, RESTful API
        - Thành thạo SQL, database design
        - Có kinh nghiệm integration với third-party services
        - Tư duy logic tốt, cẩn thận, tỉ mỉ',
        'Ba Đình, Hà Nội', 'full_time', 'middle', 25000000, 40000000, 'VND', 'internal', NULL,
        'careers@techcombank.com.vn',
        45, '2025-12-30', TRUE, 'acc_013', 'acc_013', NOW(), NOW()),

       (15, 15, 9, 10, 'Embedded Software Engineer',
        'Bosch Vietnam tuyển dụng Embedded Engineer để phát triển phần mềm cho automotive và IoT devices. Làm việc với công nghệ tiên tiến.',
        '- Tốt nghiệp Đại học chuyên ngành CNTT, Điện tử
        - Có kinh nghiệm lập trình C/C++ cho embedded systems
        - Hiểu biết về RTOS, microcontrollers
        - Có kinh nghiệm với automotive protocols (CAN, LIN) là lợi thế
        - Đọc hiểu tài liệu tiếng Anh tốt
        - Ham học hỏi công nghệ mới',
        'Khu Công nghệ cao, Thủ Đức, TP.HCM', 'full_time', 'junior', 18000000, 28000000, 'VND', 'external',
        'https://www.bosch.com.vn/careers', NULL,
        18, '2025-12-12', TRUE, 'acc_014', 'acc_014', NOW(), NOW()),

       (16, 1, 6, 2, 'Angular Developer',
        'FPT Software Hà Nội tuyển dụng Angular Developer cho dự án khách hàng Nhật Bản. Onsite tại Nhật sau 1 năm.',
        '- 1+ năm kinh nghiệm Angular (Angular 12+)
        - Thành thạo TypeScript, RxJS
        - Hiểu biết về Angular Material, NgRx
        - Có kinh nghiệm responsive design
        - Biết tiếng Nhật N3 trở lên là lợi thế lớn
        - Sẵn sàng đi onsite Nhật Bản',
        'Cầu Giấy, Hà Nội', 'full_time', 'junior', 18000000, 30000000, 'VND', 'internal', NULL, 'careers@fpt.com',
        41, '2025-11-22', TRUE, 'acc_001', 'acc_001', NOW(), NOW()),

       (17, 2, 13, 1, 'Graphic Designer',
        'VNG tuyển dụng Graphic Designer cho team Marketing. Thiết kế materials cho campaigns, events, social media của các sản phẩm Zalo, ZaloPay.',
        '- 1+ năm kinh nghiệm graphic design
        - Thành thạo Adobe Creative Suite (Photoshop, Illustrator, After Effects)
        - Có sense thẩm mỹ tốt, cập nhật xu hướng design
        - Portfolio ấn tượng
        - Có kinh nghiệm motion graphics là lợi thế
        - Làm việc nhanh, chịu được deadline',
        'Quận 7, TP. Hồ Chí Minh', 'full_time', 'junior', 12000000, 20000000, 'VND', 'internal', NULL,
        'recruitment@vng.com.vn',
        56, '2025-11-18', TRUE, 'acc_002', 'acc_002', NOW(), NOW()),

       (18, 4, 14, 1, 'Digital Marketing Executive',
        'Tiki tuyển dụng Digital Marketing Executive để chạy campaigns trên Facebook, Google Ads, TikTok. Performance marketing focus.',
        '- 1+ năm kinh nghiệm digital marketing
        - Có kinh nghiệm chạy Facebook Ads, Google Ads
        - Hiểu biết về SEO, SEM
        - Biết phân tích data, optimize campaigns
        - Có kinh nghiệm e-commerce là lợi thế
        - Tư duy sáng tạo, chủ động',
        'Quận Tân Bình, TP. Hồ Chí Minh', 'full_time', 'junior', 12000000, 18000000, 'VND', 'internal', NULL,
        'jobs@tiki.vn',
        72, '2025-11-25', TRUE, 'acc_003', 'acc_003', NOW(), NOW()),

       (19, 6, 15, 1, 'Content Creator (Video)',
        'Momo tuyển dụng Content Creator để sản xuất video content cho các chiến dịch marketing trên TikTok, YouTube, Facebook.',
        '- 1+ năm kinh nghiệm content creation
        - Thành thạo Adobe Premiere, After Effects, CapCut
        - Có kỹ năng quay dựng video
        - Hiểu xu hướng social media, viral content
        - Sáng tạo, năng động
        - Có kênh TikTok/YouTube cá nhân là lợi thế',
        'Quận 7, TP. Hồ Chí Minh', 'full_time', 'junior', 10000000, 18000000, 'VND', 'internal', NULL,
        'careers@momo.vn',
        64, '2025-12-01', TRUE, 'acc_005', 'acc_005', NOW(), NOW()),

       (20, 10, 3, 1, 'Business Development Executive',
        'Grab tuyển dụng BD Executive để mở rộng merchant partners. Cơ hội thăng tiến nhanh trong môi trường startup.',
        '- Sinh viên mới tốt nghiệp hoặc 1 năm kinh nghiệm BD/Sales
        - Kỹ năng giao tiếp, thuyết phục tốt
        - Chủ động, năng động, không ngại đi field
        - Tiếng Anh giao tiếp tốt
        - Có kinh nghiệm B2B sales là lợi thế
        - Có xe máy, biết đi đường',
        'Quận 10, TP. Hồ Chí Minh', 'full_time', 'fresher', 10000000, 15000000, 'VND', 'internal', NULL,
        'careers.vn@grab.com',
        83, '2025-11-30', TRUE, 'acc_009', 'acc_009', NOW(), NOW());

-- Job Skills mapping
INSERT INTO job_skills (id, job_id, skill_id, is_required)
VALUES
-- Job 1: Backend Intern Java
(1, 1, 1, TRUE),    -- Java required
(2, 1, 7, FALSE),   -- PostgreSQL optional
-- Job 2: Frontend ReactJS
(3, 2, 2, TRUE),    -- ReactJS required
(4, 2, 16, TRUE),   -- TypeScript required
-- Job 3: Backend Golang/Python
(5, 3, 4, TRUE),    -- Python required
(6, 3, 17, TRUE),   -- Golang required
(7, 3, 9, TRUE),    -- Docker required
-- Job 4: Full Stack
(8, 4, 3, TRUE),    -- NodeJS required
(9, 4, 2, TRUE),    -- ReactJS required
(10, 4, 16, TRUE),  -- TypeScript required
-- Job 5: Backend Senior Java
(11, 5, 1, TRUE),   -- Java required
(12, 5, 7, TRUE),   -- PostgreSQL required
(13, 5, 11, FALSE), -- AWS optional
-- Job 6: Unity Developer
(14, 6, 18, TRUE),  -- C#/.NET required
-- Job 7: React Native
(15, 7, 15, TRUE),  -- React Native required
(16, 7, 16, TRUE),  -- TypeScript required
-- Job 8: DevOps
(17, 8, 9, TRUE),   -- Docker required
(18, 8, 10, TRUE),  -- Kubernetes required
(19, 8, 11, FALSE), -- AWS optional
-- Job 9: Backend Golang
(20, 9, 17, TRUE),  -- Golang required
(21, 9, 9, TRUE),   -- Docker required
-- Job 10: UI/UX Designer
(22, 10, 19, TRUE), -- UI/UX Design required
-- Job 11: Data Engineer
(23, 11, 4, TRUE),  -- Python required
(24, 11, 7, TRUE),  -- PostgreSQL required
-- Job 12: QA Automation
(25, 12, 1, FALSE), -- Java optional
(26, 12, 16, FALSE),-- TypeScript optional
-- Job 13: iOS Developer
(27, 13, 18, TRUE), -- C#/.NET (Swift similar) required
-- Job 14: Java Banking
(28, 14, 1, TRUE),  -- Java required
(29, 14, 7, TRUE),  -- PostgreSQL required
-- Job 15: Embedded
(30, 15, 18, TRUE), -- C#/.NET (C++ similar) required
-- Job 16: Angular
(31, 16, 5, TRUE),
(32, 16, 16, TRUE);
-- Job 17-20: Non-technical positions don't need tech skills mapping

-- Applications
-- Applications (đã cast responses -> ::jsonb)
INSERT INTO applications (id, job_id, student_id, status, resume_url, cover_url, responses, created_by, updated_by,
                          created_at, updated_at)
VALUES (1, 1, 1, 'applied', 'https://drive.google.com/resume/nguyenvanan.pdf', NULL,
        '{"motivation": "Em rất đam mê backend development và muốn được học hỏi từ các anh chị tại FPT", "availability": "Có thể bắt đầu ngay"}'::jsonb,
        'acc_001', 'acc_001', NOW() - INTERVAL '2 days', NOW()),

       (2, 2, 2, 'reviewed', 'https://drive.google.com/resume/tranbinh.pdf',
        'https://drive.google.com/cover/tranbinh.pdf',
        '{"motivation": "Em có 1 năm kinh nghiệm ReactJS qua các dự án cá nhân và freelance", "portfolio": "https://github.com/tranbinh"}'::jsonb,
        'acc_002', 'acc_002', NOW() - INTERVAL '5 days', NOW()),

       (3, 3, 4, 'interviewed', 'https://drive.google.com/resume/phamminhduc.pdf', NULL,
        '{"motivation": "Em đã có kinh nghiệm xây dựng microservices với Golang", "experience": "2 năm tại startup fintech"}'::jsonb,
        'acc_004', 'acc_004', NOW() - INTERVAL '7 days', NOW()),

       (4, 4, 5, 'applied', 'https://drive.google.com/resume/hoangthiem.pdf', NULL,
        '{"motivation": "Em thích làm full stack để hiểu end-to-end flow", "projects": "Đã build 3 side projects với MERN stack"}'::jsonb,
        'acc_005', 'acc_005', NOW() - INTERVAL '1 day', NOW()),

       (5, 5, 8, 'offered', 'https://drive.google.com/resume/buitlinh.pdf',
        'https://drive.google.com/cover/buitlinh.pdf',
        '{"motivation": "Em có 3 năm kinh nghiệm Java Spring Boot và đam mê payment systems", "achievements": "Từng handle 10K TPS tại công ty cũ"}'::jsonb,
        'acc_008', 'acc_008', NOW() - INTERVAL '15 days', NOW()),

       (6, 7, 9, 'applied', 'https://drive.google.com/resume/ngominhquan.pdf', NULL,
        '{"motivation": "Em yêu thích UI/UX và muốn contribute vào product có impact lớn", "portfolio": "https://dribbble.com/ngominhquan"}'::jsonb,
        'acc_009', 'acc_009', NOW() - INTERVAL '3 days', NOW()),

       (7, 10, 9, 'reviewed', 'https://drive.google.com/resume/ngominhquan.pdf', NULL,
        '{"motivation": "Em có background UI/UX từ RMIT và portfolio 15+ projects", "tools": "Thành thạo Figma, Adobe XD"}'::jsonb,
        'acc_009', 'acc_009', NOW() - INTERVAL '6 days', NOW()),

       (8, 12, 11, 'applied', 'https://drive.google.com/resume/phanvanhai.pdf', NULL,
        '{"motivation": "Em có kinh nghiệm automation testing với Selenium", "experience": "1 năm QA tại outsourcing company"}'::jsonb,
        'acc_011', 'acc_011', NOW() - INTERVAL '4 days', NOW()),

       (9, 14, 15, 'interviewed', 'https://drive.google.com/resume/trinhvantung.pdf',
        'https://drive.google.com/cover/trinhvantung.pdf',
        '{"motivation": "Em muốn làm việc trong lĩnh vực banking technology", "experience": "2 năm Java developer"}'::jsonb,
        'acc_015', 'acc_015', NOW() - INTERVAL '10 days', NOW()),

       (10, 18, 12, 'applied', 'https://drive.google.com/resume/dinhthimai.pdf', NULL,
        '{"motivation": "Em có kinh nghiệm chạy ads cho e-commerce từ internship", "results": "ROAS 4.5x trong chiến dịch cuối cùng"}'::jsonb,
        'acc_012', 'acc_012', NOW() - INTERVAL '2 days', NOW());

-- User Saved Jobs
INSERT INTO user_saved_jobs (id, student_id, job_id, saved_at)
VALUES (1, 1, 2, NOW() - INTERVAL '1 day'),
       (2, 1, 4, NOW() - INTERVAL '3 days'),
       (3, 2, 1, NOW() - INTERVAL '2 days'),
       (4, 3, 3, NOW() - INTERVAL '1 day'),
       (5, 4, 5, NOW() - INTERVAL '4 days'),
       (6, 5, 4, NOW() - INTERVAL '2 days'),
       (7, 6, 7, NOW() - INTERVAL '1 day'),
       (8, 7, 10, NOW() - INTERVAL '5 days'),
       (9, 9, 7, NOW() - INTERVAL '1 day'),
       (10, 9, 10, NOW() - INTERVAL '2 days'),
       (11, 11, 12, NOW() - INTERVAL '3 days'),
       (12, 12, 18, NOW() - INTERVAL '1 day'),
       (13, 13, 14, NOW() - INTERVAL '2 days'),
       (14, 15, 14, NOW() - INTERVAL '4 days');

-- Tags (Realistic Vietnamese job filters)
-- Tags (đã cast filter_config -> ::jsonb)
INSERT INTO tags (id, title, tag_type, filter_config, description, is_active, created_at, updated_at)
VALUES (1, 'Toàn thời gian', 'employment_type', '{"value": "full_time"}'::jsonb, 'Làm việc full-time', true, now(),
        now()),
       (2, 'Bán thời gian', 'employment_type', '{"value": "part_time"}'::jsonb, 'Làm việc part-time', true, now(),
        now()),
       (3, 'Thực tập', 'employment_type', '{"value": "internship"}'::jsonb, 'Vị trí thực tập sinh', true, now(), now()),
       (4, 'Freelance', 'employment_type', '{"value": "contract"}'::jsonb, 'Làm theo dự án', true, now(), now()),

       (5, 'Thực tập sinh', 'experience_level', '{"value": "internship"}'::jsonb, 'Sinh viên/mới tốt nghiệp', true,
        now(), now()),
       (6, 'Fresher (< 1 năm)', 'experience_level', '{"value": "fresher"}'::jsonb, 'Dưới 1 năm kinh nghiệm', true,
        now(), now()),
       (7, 'Junior (1-2 năm)', 'experience_level', '{"value": "junior"}'::jsonb, '1-2 năm kinh nghiệm', true, now(),
        now()),
       (8, 'Middle (2-4 năm)', 'experience_level', '{"value": "middle"}'::jsonb, '2-4 năm kinh nghiệm', true, now(),
        now()),
       (9, 'Senior (4+ năm)', 'experience_level', '{"value": "senior"}'::jsonb, 'Trên 4 năm kinh nghiệm', true, now(),
        now()),

       (10, 'Dưới 10 triệu', 'salary_range', '{"min":0,"max":10000000,"currency":"VND"}'::jsonb,
        'Mức lương dưới 10 triệu', true, now(), now()),
       (11, '10-15 triệu', 'salary_range', '{"min":10000000,"max":15000000,"currency":"VND"}'::jsonb,
        'Lương từ 10-15 triệu', true, now(), now()),
       (12, '15-25 triệu', 'salary_range', '{"min":15000000,"max":25000000,"currency":"VND"}'::jsonb,
        'Lương từ 15-25 triệu', true, now(), now()),
       (13, '25-40 triệu', 'salary_range', '{"min":25000000,"max":40000000,"currency":"VND"}'::jsonb,
        'Lương từ 25-40 triệu', true, now(), now()),
       (14, 'Trên 40 triệu', 'salary_range', '{"min":40000000,"currency":"VND"}'::jsonb, 'Lương trên 40 triệu', true,
        now(), now()),

       (100, 'Java', 'skill', '{"skill_id": 1}'::jsonb, 'Java development', true, now(), now()),
       (101, 'ReactJS', 'skill', '{"skill_id": 2}'::jsonb, 'React frontend', true, now(), now()),
       (102, 'NodeJS', 'skill', '{"skill_id": 3}'::jsonb, 'Node.js backend', true, now(), now()),
       (103, 'Python', 'skill', '{"skill_id": 4}'::jsonb, 'Python development', true, now(), now()),
       (104, 'Golang', 'skill', '{"skill_id": 17}'::jsonb, 'Golang backend development', true, now(), now()),
       (105, 'Python', 'skill', '{"skill_id": 4}'::jsonb, 'Python development', true, now(), now()),
       (106, 'React Native', 'skill', '{"skill_id": 15}'::jsonb, 'Mobile app development bằng React Native', true,
        now(), now()),
       (107, 'DevOps', 'skill', '{"skill_id": 9}'::jsonb, 'Docker, Kubernetes, CI/CD', true, now(), now()),
       (108, 'UI/UX', 'skill', '{"skill_id": 19}'::jsonb, 'UI/UX design, Figma, Adobe XD', true, now(), now()),
       (109, 'Data Engineer', 'skill', '{"skill_id": 10}'::jsonb, 'Data pipeline, ETL, Big Data', true, now(), now()),
       (110, 'Marketing', 'skill', '{"skill_id": 20}'::jsonb, 'SEO, SEM, Digital Marketing', true, now(), now());
