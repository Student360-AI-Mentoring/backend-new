-- National Student IDs (10 records)
INSERT INTO national_student_ids (id, full_name, date_of_birth, university, major, enrollment_year, graduation_year, created_at, updated_at)
VALUES
('NS001', 'Nguyen Van An', '2002-05-15', 'Ho Chi Minh City University of Technology', 'Computer Science', 2021, 2025, NOW(), NOW()),
('NS002', 'Tran Thi Binh', '2001-08-22', 'Vietnam National University', 'Information Technology', 2020, 2024, NOW(), NOW()),
('NS003', 'Le Van Cuong', '2003-01-10', 'University of Economics Ho Chi Minh City', 'Business Administration', 2022, 2026, NOW(), NOW()),
('NS004', 'Pham Thi Dung', '2000-12-03', 'Hanoi University of Science and Technology', 'Software Engineering', 2019, 2023, NOW(), NOW()),
('NS005', 'Hoang Van Em', '2002-07-18', 'Da Nang University of Technology', 'Computer Engineering', 2021, 2025, NOW(), NOW()),
('NS006', 'Vo Thi Giang', '2001-09-25', 'Can Tho University', 'Information Systems', 2020, 2024, NOW(), NOW()),
('NS007', 'Dang Van Hung', '2003-03-12', 'Hue University', 'Computer Science', 2022, 2026, NOW(), NOW()),
('NS008', 'Bui Thi Linh', '2000-11-30', 'University of Science and Technology of Hanoi', 'Data Science', 2019, 2023, NOW(), NOW()),
('NS009', 'Ngo Van Minh', '2002-06-08', 'Ho Chi Minh City Open University', 'Software Engineering', 2021, 2025, NOW(), NOW()),
('NS010', 'Truong Thi Nga', '2001-04-14', 'Posts and Telecommunications Institute of Technology', 'Information Technology', 2020, 2024, NOW(), NOW());

-- Account Types (10 records)
INSERT INTO account_types (id, name, description)
VALUES
(1, 'Student', 'Student account with basic job search capabilities'),
(2, 'Company HR', 'Company HR account for posting jobs and managing applications'),
(3, 'Company Admin', 'Company administrator with full company management access'),
(4, 'University Admin', 'University administrator for managing student records'),
(5, 'Career Counselor', 'Career counselor with student guidance permissions'),
(6, 'System Admin', 'System administrator with full platform access'),
(7, 'Alumni', 'Alumni account with networking and mentorship features'),
(8, 'Recruiter', 'Professional recruiter account with advanced search tools'),
(9, 'Freelancer', 'Freelancer account for project-based work'),
(10, 'Guest', 'Guest account with limited browsing capabilities');

-- Accounts (10 records)
INSERT INTO accounts (id, national_student_id, external_id, account_type_id, email, password_hash, is_active, is_verified, created_at, updated_at)
VALUES
('acc_001', 'NS001', 'ext_001', 1, 'nguyen.van.an@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jO', TRUE, TRUE, NOW(), NOW()),
('acc_002', 'NS002', 'ext_002', 1, 'tran.thi.binh@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jP', TRUE, TRUE, NOW(), NOW()),
('acc_003', 'NS003', 'ext_003', 1, 'le.van.cuong@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jQ', TRUE, TRUE, NOW(), NOW()),
('acc_004', 'NS004', 'ext_004', 1, 'pham.thi.dung@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jR', TRUE, TRUE, NOW(), NOW()),
('acc_005', 'NS005', 'ext_005', 1, 'hoang.van.em@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jS', TRUE, TRUE, NOW(), NOW()),
('acc_006', 'NS006', 'ext_006', 1, 'vo.thi.giang@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jT', TRUE, TRUE, NOW(), NOW()),
('acc_007', 'NS007', 'ext_007', 1, 'dang.van.hung@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jU', TRUE, TRUE, NOW(), NOW()),
('acc_008', 'NS008', 'ext_008', 1, 'bui.thi.linh@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jV', TRUE, TRUE, NOW(), NOW()),
('acc_009', 'NS009', 'ext_009', 1, 'ngo.van.minh@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jW', TRUE, TRUE, NOW(), NOW()),
('acc_010', 'NS010', 'ext_010', 1, 'truong.thi.nga@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhTuFWv2LeO.f7c6v4z2jX', TRUE, TRUE, NOW(), NOW());

-- Students (10 records)
INSERT INTO students (id, account_id, national_student_id, current_year, gpa, created_at, updated_at)
VALUES 
(1, 'acc_001', 'NS001', 2, 3.5, NOW(), NOW()),
(2, 'acc_002', 'NS002', 3, 3.8, NOW(), NOW()),
(3, 'acc_003', 'NS003', 1, 3.2, NOW(), NOW()),
(4, 'acc_004', 'NS004', 4, 3.9, NOW(), NOW()),
(5, 'acc_005', 'NS005', 2, 3.6, NOW(), NOW()),
(6, 'acc_006', 'NS006', 3, 3.4, NOW(), NOW()),
(7, 'acc_007', 'NS007', 1, 3.7, NOW(), NOW()),
(8, 'acc_008', 'NS008', 4, 3.3, NOW(), NOW()),
(9, 'acc_009', 'NS009', 2, 3.8, NOW(), NOW()),
(10, 'acc_010', 'NS010', 3, 3.5, NOW(), NOW());

-- Skills (10 records)
INSERT INTO skills (id, name, category, description, created_by, updated_by, created_at, updated_at)
VALUES
(1, 'Java', 'Programming Language', 'Backend development with Java', 'acc_001', 'acc_001', NOW(), NOW()),
(2, 'ReactJS', 'Frontend', 'UI development with React', 'acc_001', 'acc_001', NOW(), NOW()),
(3, 'SQL', 'Database', 'Database querying and management', 'acc_002', 'acc_002', NOW(), NOW()),
(4, 'Python', 'Programming Language', 'Data science and backend development', 'acc_003', 'acc_003', NOW(), NOW()),
(5, 'Angular', 'Frontend', 'Frontend framework for web applications', 'acc_004', 'acc_004', NOW(), NOW()),
(6, 'MongoDB', 'Database', 'NoSQL database management', 'acc_005', 'acc_005', NOW(), NOW()),
(7, 'Financial Analysis', 'Finance', 'Financial modeling and analysis', 'acc_006', 'acc_006', NOW(), NOW()),
(8, 'Teaching', 'Education', 'Instruction and curriculum development', 'acc_007', 'acc_007', NOW(), NOW()),
(9, 'Docker', 'DevOps', 'Containerization and deployment', 'acc_008', 'acc_008', NOW(), NOW()),
(10, 'Machine Learning', 'AI/ML', 'Artificial intelligence and data modeling', 'acc_009', 'acc_009', NOW(), NOW());

-- Industries (15 records - với parent_id để tạo cấu trúc phân cấp)
INSERT INTO industries (id, parent_id, name, description)
VALUES
-- Parent industries
(1, NULL, 'Information Technology', 'Software, hardware, and IT services'),
(2, NULL, 'Finance', 'Banking, investment, and insurance'),
(3, NULL, 'Education', 'Schools, universities, and training institutions'),
(4, NULL, 'Healthcare', 'Medical services and pharmaceutical'),
(5, NULL, 'Manufacturing', 'Production and industrial operations'),
(6, NULL, 'Retail', 'Consumer goods and services'),
(7, NULL, 'Consulting', 'Business advisory and professional services'),
(8, NULL, 'Media & Entertainment', 'Publishing, broadcasting, and digital content'),
(9, NULL, 'Government', 'Public sector and administration'),
(10, NULL, 'Non-Profit', 'Charitable organizations and NGOs'),
-- Child industries under IT
(11, 1, 'Software Development', 'Custom software and application development'),
(12, 1, 'Cybersecurity', 'Information security and data protection'),
(13, 1, 'Cloud Computing', 'Cloud infrastructure and services'),
-- Child industries under Finance
(14, 2, 'Investment Banking', 'Corporate finance and M&A advisory'),
(15, 2, 'Fintech', 'Financial technology and digital payments');

-- Companies (10 records)
INSERT INTO companies (id, name, description, website, industry_id, size, contact_email, logo_url, address)
VALUES
(1, 'TechCorp', 'Software solutions provider', 'https://techcorp.com', 1, 200, 'hr@techcorp.com', 'https://logo.com/techcorp.png', '123 Tech Street'),
(2, 'FinServe', 'Financial services company', 'https://finserve.com', 2, 500, 'jobs@finserve.com', 'https://logo.com/finserve.png', '45 Finance Ave'),
(3, 'EduTech Solutions', 'Educational technology platform', 'https://edutech.com', 3, 150, 'careers@edutech.com', 'https://logo.com/edutech.png', '789 Education Blvd'),
(4, 'HealthPlus', 'Healthcare technology company', 'https://healthplus.com', 4, 300, 'hr@healthplus.com', 'https://logo.com/healthplus.png', '321 Medical Center'),
(5, 'ManufacCorp', 'Industrial manufacturing', 'https://manufacorp.com', 5, 1000, 'jobs@manufacorp.com', 'https://logo.com/manufacorp.png', '555 Industrial Park'),
(6, 'RetailMax', 'E-commerce platform', 'https://retailmax.com', 6, 800, 'talent@retailmax.com', 'https://logo.com/retailmax.png', '777 Commerce St'),
(7, 'ConsultPro', 'Business consulting firm', 'https://consultpro.com', 7, 250, 'recruit@consultpro.com', 'https://logo.com/consultpro.png', '999 Business Plaza'),
(8, 'MediaVerse', 'Digital media company', 'https://mediaverse.com', 8, 400, 'hiring@mediaverse.com', 'https://logo.com/mediaverse.png', '111 Creative Ave'),
(9, 'GovTech', 'Government technology solutions', 'https://govtech.com', 9, 600, 'careers@govtech.com', 'https://logo.com/govtech.png', '222 Public Square'),
(10, 'GreenFuture', 'Environmental non-profit', 'https://greenfuture.org', 10, 100, 'jobs@greenfuture.org', 'https://logo.com/greenfuture.png', '333 Earth Way');

-- Locations (10 records)
INSERT INTO locations (id, name)
VALUES
(1, 'Ho Chi Minh City'),
(2, 'Hanoi'),
(3, 'Da Nang'),
(4, 'Can Tho'),
(5, 'Hai Phong'),
(6, 'Nha Trang'),
(7, 'Hue'),
(8, 'Vung Tau'),
(9, 'Bien Hoa'),
(10, 'Thu Dau Mot');

-- Salary Currencies (10 records)
INSERT INTO salary_currencies (code, name, symbol)
VALUES
('VND', 'Vietnamese Dong', '₫'),
('USD', 'US Dollar', '$'),
('EUR', 'Euro', '€'),
('GBP', 'British Pound', '£'),
('JPY', 'Japanese Yen', '¥'),
('AUD', 'Australian Dollar', 'A$'),
('CAD', 'Canadian Dollar', 'C$'),
('SGD', 'Singapore Dollar', 'S$'),
('THB', 'Thai Baht', '฿'),
('KRW', 'Korean Won', '₩');

-- Jobs (10 records) - Sử dụng industry_id thay vì category_id
INSERT INTO jobs (
  id, company_id, industry_id, location_id, title, description, requirements,
  job_type, experience_level, salary_min, salary_max, salary_currency,
  application_method, application_url, application_email, apply_count,
  deadline, is_active, created_by, updated_by, created_at, updated_at
)
VALUES
(1, 1, 11, 1, 'Backend Developer Intern', 'Work with NestJS and PostgreSQL', 'Knowledge of Node.js or TypeScript',
 'internship', 'internship', 3000000, 5000000, 'VND', 'internal', NULL, 'apply@techcorp.com',
 0, '2025-12-31', TRUE, 'acc_001', 'acc_001', NOW(), NOW()),
(2, 2, 15, 2, 'Frontend Engineer', 'Develop React applications for finance dashboards', 'Experience with React or Angular',
 'full_time', 'junior', 1200, 2000, 'USD', 'external', 'https://finserve.com/careers/frontend', NULL,
 0, '2025-11-30', TRUE, 'acc_002', 'acc_002', NOW(), NOW()),
(3, 3, 3, 3, 'Education Technology Specialist', 'Develop educational software solutions', 'Experience in education and technology',
 'full_time', 'middle', 800, 1200, 'USD', 'internal', NULL, 'careers@edutech.com',
 5, '2025-10-15', TRUE, 'acc_003', 'acc_003', NOW(), NOW()),
(4, 4, 4, 4, 'Healthcare Data Analyst', 'Analyze medical data and create reports', 'Background in healthcare and data analysis',
 'full_time', 'junior', 15000000, 25000000, 'VND', 'external', 'https://healthplus.com/jobs/analyst', NULL,
 3, '2025-11-15', TRUE, 'acc_004', 'acc_004', NOW(), NOW()),
(5, 5, 5, 5, 'Manufacturing Software Engineer', 'Develop industrial automation systems', 'Engineering background with programming skills',
 'full_time', 'senior', 2000, 3000, 'USD', 'internal', NULL, 'jobs@manufacorp.com',
 8, '2026-01-31', TRUE, 'acc_005', 'acc_005', NOW(), NOW()),
(6, 6, 11, 6, 'Full Stack Developer', 'Build e-commerce platform features', 'Experience with React, Node.js, and databases',
 'full_time', 'middle', 1500, 2500, 'USD', 'external', 'https://retailmax.com/careers/fullstack', NULL,
 12, '2025-12-15', TRUE, 'acc_006', 'acc_006', NOW(), NOW()),
(7, 7, 7, 7, 'Business Analyst Intern', 'Support consulting projects and client analysis', 'Strong analytical and communication skills',
 'internship', 'internship', 5000000, 8000000, 'VND', 'internal', NULL, 'recruit@consultpro.com',
 2, '2025-10-30', TRUE, 'acc_007', 'acc_007', NOW(), NOW()),
(8, 8, 8, 8, 'UI/UX Designer', 'Design user interfaces for media applications', 'Portfolio in UI/UX design',
 'full_time', 'junior', 1000, 1800, 'USD', 'external', 'https://mediaverse.com/jobs/designer', NULL,
 7, '2025-11-20', TRUE, 'acc_008', 'acc_008', NOW(), NOW()),
(9, 9, 1, 9, 'Government Software Developer', 'Build public service digital platforms', 'Security clearance and development experience',
 'full_time', 'senior', 35000000, 50000000, 'VND', 'internal', NULL, 'careers@govtech.com',
 15, '2026-02-28', TRUE, 'acc_009', 'acc_009', NOW(), NOW()),
(10, 10, 10, 10, 'Environmental Education Coordinator', 'Develop and deliver environmental education programs', 'Background in environmental science and education',
 'part_time', 'middle', 600, 1000, 'USD', 'external', 'https://greenfuture.org/jobs/coordinator', NULL,
 4, '2025-12-01', TRUE, 'acc_010', 'acc_010', NOW(), NOW());

-- Job Skills (10 records)
INSERT INTO job_skills (id, job_id, skill_id, is_required)
VALUES
(1, 1, 1, TRUE),
(2, 1, 3, TRUE),
(3, 2, 2, TRUE),
(4, 3, 8, TRUE),
(5, 3, 4, FALSE),
(6, 4, 7, TRUE),
(7, 4, 3, TRUE),
(8, 5, 1, TRUE),
(9, 6, 2, TRUE),
(10, 6, 4, TRUE);

-- Applications (10 records)
INSERT INTO applications (id, job_id, student_id, status, resume_url, cover_url, responses, created_by, updated_by, created_at, updated_at)
VALUES
(1, 1, 1, 'applied', 'https://cv.com/student1.pdf', 'https://cv.com/student1-cover.pdf', '{"q1": "I love backend development"}', 'acc_001', 'acc_001', NOW(), NOW()),
(2, 2, 2, 'reviewed', 'https://cv.com/student2.pdf', 'https://cv.com/student2-cover.pdf', '{"q1": "React is my strength"}', 'acc_002', 'acc_002', NOW(), NOW()),
(3, 3, 3, 'interviewed', 'https://cv.com/student3.pdf', 'https://cv.com/student3-cover.pdf', '{"q1": "Passionate about education technology"}', 'acc_003', 'acc_003', NOW(), NOW()),
(4, 4, 4, 'offered', 'https://cv.com/student4.pdf', 'https://cv.com/student4-cover.pdf', '{"q1": "Healthcare data analysis experience"}', 'acc_004', 'acc_004', NOW(), NOW()),
(5, 5, 5, 'applied', 'https://cv.com/student5.pdf', 'https://cv.com/student5-cover.pdf', '{"q1": "Industrial automation interests me"}', 'acc_005', 'acc_005', NOW(), NOW()),
(6, 6, 6, 'rejected', 'https://cv.com/student6.pdf', 'https://cv.com/student6-cover.pdf', '{"q1": "Full stack development skills"}', 'acc_006', 'acc_006', NOW(), NOW()),
(7, 7, 7, 'applied', 'https://cv.com/student7.pdf', 'https://cv.com/student7-cover.pdf', '{"q1": "Business analysis is my goal"}', 'acc_007', 'acc_007', NOW(), NOW()),
(8, 8, 8, 'reviewed', 'https://cv.com/student8.pdf', 'https://cv.com/student8-cover.pdf', '{"q1": "Creative UI/UX portfolio"}', 'acc_008', 'acc_008', NOW(), NOW()),
(9, 9, 9, 'interviewed', 'https://cv.com/student9.pdf', 'https://cv.com/student9-cover.pdf', '{"q1": "Public service technology focus"}', 'acc_009', 'acc_009', NOW(), NOW()),
(10, 10, 10, 'applied', 'https://cv.com/student10.pdf', 'https://cv.com/student10-cover.pdf', '{"q1": "Environmental education passion"}', 'acc_010', 'acc_010', NOW(), NOW());

-- User Saved Jobs (10 records)
INSERT INTO user_saved_jobs (id, student_id, job_id, saved_at)
VALUES
(1, 1, 2, NOW()),
(2, 2, 1, NOW()),
(3, 3, 4, NOW()),
(4, 4, 3, NOW()),
(5, 5, 6, NOW()),
(6, 6, 5, NOW()),
(7, 7, 8, NOW()),
(8, 8, 7, NOW()),
(9, 9, 10, NOW()),
(10, 10, 9, NOW());

-- Tags (Filter tags for job search)
INSERT INTO tags (id, title, tag_type, filter_config, description, is_active, created_at, updated_at)
VALUES
-- Job Type
(1, 'Full-time', 'job_type', '{"single_select": true}', 'Full-time jobs', true, now(), now()),
(2, 'Part-time', 'job_type', '{"single_select": true}', 'Part-time jobs', true, now(), now()),
(3, 'Internship', 'job_type', '{"single_select": true}', 'Internship jobs', true, now(), now()),
(4, 'Contract', 'job_type', '{"single_select": true}', 'Contract jobs', true, now(), now()),
-- Experience Level
(5, 'Internship', 'experience_level', '{"single_select": true}', 'Internship level jobs', true, now(), now()),
(6, 'Fresher', 'experience_level', '{"single_select": true}', 'Fresher level jobs', true, now(), now()),
(7, 'Junior', 'experience_level', '{"single_select": true}', 'Junior level jobs', true, now(), now()),
(8, 'Middle', 'experience_level', '{"single_select": true}', 'Middle level jobs', true, now(), now()),
(9, 'Senior', 'experience_level', '{"single_select": true}', 'Senior level jobs', true, now(), now()),
-- Salary Ranges
(10, '0 - 10M VND', 'salary_range', '{"min":0,"max":10000000}', 'Salary up to 10M VND', true, now(), now()),
(11, '10M - 20M VND', 'salary_range', '{"min":10000000,"max":20000000}', 'Salary from 10M to 20M VND', true, now(), now()),
(12, '20M - 30M VND', 'salary_range', '{"min":20000000,"max":30000000}', 'Salary from 20M to 30M VND', true, now(), now()),
(13, '30M+ VND', 'salary_range', '{"min":30000000}', 'Salary above 30M VND', true, now(), now()),
-- Industries (thay thế job_categories)
(100, 'Information Technology', 'industry', NULL, 'Software, hardware, and IT services', true, now(), now()),
(101, 'Finance', 'industry', NULL, 'Banking, investment, and insurance', true, now(), now()),
(102, 'Education', 'industry', NULL, 'Teaching and educational roles', true, now(), now()),
(103, 'Healthcare', 'industry', NULL, 'Medical and healthcare positions', true, now(), now()),
(104, 'Software Development', 'industry', NULL, 'Custom software and application development', true, now(), now()),
(105, 'Fintech', 'industry', NULL, 'Financial technology and digital payments', true, now(), now()),
(106, 'Consulting', 'industry', NULL, 'Business advisory and professional services', true, now(), now()),
(107, 'Media & Entertainment', 'industry', NULL, 'Publishing and digital content', true, now(), now()),
(108, 'Manufacturing', 'industry', NULL, 'Production and industrial operations', true, now(), now()),
(109, 'Non-Profit', 'industry', NULL, 'Charitable organizations', true, now(), now());

-- Tag Positions (Filter groups)
INSERT INTO tag_positions (id, tag_id, position, sort_order, is_shown, priority, created_at, updated_at)
VALUES
(1, 1, 'job_search_filter', 1, true, 10, now(), now()),
(2, 5, 'job_search_filter', 2, true, 20, now(), now()),
(3, 10, 'job_search_filter', 3, true, 30, now(), now()),
(200, 100, 'job_search_filter', 1, true, 50, now(), now()),
(201, 101, 'job_search_filter', 2, true, 50, now(), now()),
(202, 102, 'job_search_filter', 3, true, 50, now(), now()),
(203, 103, 'job_search_filter', 4, true, 50, now(), now()),
(204, 104, 'job_search_filter', 1, true, 40, now(), now()),
(205, 105, 'job_search_filter', 2, true, 40, now(), now()),
(206, 106, 'job_search_filter', 3, true, 40, now(), now()),
(207, 107, 'job_search_filter', 4, true, 40, now(), now()),
(208, 108, 'job_search_filter', 5, true, 40, now(), now()),
(209, 109, 'job_search_filter', 6, true, 40, now(), now());

-- Tag Positions Tag Search (Linking tags to their filter groups)
INSERT INTO tag_positions_tag_search (id, tag_position_id, tag_search_id, sort, created_at, updated_at)
VALUES
-- Job Type group
(1, 1, 1, 1, now(), now()),
(2, 1, 2, 2, now(), now()),
(3, 1, 3, 3, now(), now()),
(4, 1, 4, 4, now(), now()),
-- Experience Level group
(5, 2, 5, 1, now(), now()),
(6, 2, 6, 2, now(), now()),
(7, 2, 7, 3, now(), now()),
(8, 2, 8, 4, now(), now()),
(9, 2, 9, 5, now(), now()),
-- Salary Range group
(10, 3, 10, 1, now(), now()),
(11, 3, 11, 2, now(), now()),
(12, 3, 12, 3, now(), now()),
(13, 3, 13, 4, now(), now()),
-- Industries relationships
(14, 204, 100, 1, now(), now()),
(15, 205, 101, 2, now(), now()),
(16, 206, 100, 3, now(), now()),
(17, 207, 100, 4, now(), now()),
(18, 208, 100, 5, now(), now()),
(19, 209, 100, 6, now(), now());