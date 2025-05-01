# Educational Platform Database Schema

This document outlines the PostgreSQL database schema for our educational platform. The platform connects teachers with students, allows parents to manage their children's learning, and provides administrative oversight.

## Database Tables and Relationships

### Users and Authentication

#### `users` Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'parent', 'teacher', 'kid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255)
);
```

#### `verification_documents` Table
```sql
CREATE TABLE verification_documents (
    document_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);
```

#### `refresh_tokens` Table
```sql
CREATE TABLE refresh_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    device_info TEXT
);
```

### Teacher Profiles

#### `teacher_profiles` Table
```sql
CREATE TABLE teacher_profiles (
    teacher_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    specialty VARCHAR(100),
    experience_years INTEGER,
    total_xp INTEGER DEFAULT 0,
    teacher_title VARCHAR(50) DEFAULT 'Beginner Teacher',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE
);
```

### Parent-Kid Relationship

#### `parent_profiles` Table
```sql
CREATE TABLE parent_profiles (
    parent_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    address TEXT,
    preferred_contact_method VARCHAR(20) DEFAULT 'email'
);
```

#### `kids` Table
```sql
CREATE TABLE kids (
    kid_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES parent_profiles(parent_id) ON DELETE CASCADE,
    birth_date DATE,
    age INTEGER,
    total_xp INTEGER DEFAULT 0,
    current_title VARCHAR(50) DEFAULT 'Novice',
    avatar_url VARCHAR(255)
);
```

### Courses and XP System

#### `course_sizes` Table
```sql
CREATE TABLE course_sizes (
    size_id SERIAL PRIMARY KEY,
    size_code CHAR(1) NOT NULL UNIQUE CHECK (size_code IN ('S', 'M', 'L', 'XL')),
    base_xp INTEGER NOT NULL,
    description TEXT
);
```

#### `courses` Table
```sql
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teacher_profiles(teacher_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    size_id INTEGER REFERENCES course_sizes(size_id),
    xp_reward INTEGER NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    thumbnail_url VARCHAR(255)
);
```

#### `course_materials` Table
```sql
CREATE TABLE course_materials (
    material_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255),
    material_type VARCHAR(50) NOT NULL,
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Progress Tracking

#### `enrollments` Table
```sql
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    kid_id INTEGER REFERENCES kids(kid_id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    progress_percentage INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    UNIQUE(kid_id, course_id)
);
```

#### `progress_logs` Table
```sql
CREATE TABLE progress_logs (
    log_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES course_materials(material_id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INTEGER
);
```

### Ratings and Reports

#### `course_ratings` Table
```sql
CREATE TABLE course_ratings (
    rating_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `course_reports` Table
```sql
CREATE TABLE course_reports (
    report_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    teacher_notes TEXT,
    kid_performance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE
);
```

### XP Titles System

#### `xp_titles_kids` Table
```sql
CREATE TABLE xp_titles_kids (
    title_id SERIAL PRIMARY KEY,
    title_name VARCHAR(50) UNIQUE NOT NULL,
    min_xp_required INTEGER NOT NULL,
    description TEXT,
    badge_url VARCHAR(255)
);
```

#### `xp_titles_teachers` Table
```sql
CREATE TABLE xp_titles_teachers (
    title_id SERIAL PRIMARY KEY,
    title_name VARCHAR(50) UNIQUE NOT NULL,
    min_xp_required INTEGER NOT NULL,
    description TEXT,
    badge_url VARCHAR(255)
);
```

### Contact and Communication

#### `contact_messages` Table
```sql
CREATE TABLE contact_messages (
    message_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    read_by INTEGER REFERENCES users(user_id),
    read_at TIMESTAMP WITH TIME ZONE
);
```

#### `notifications` Table
```sql
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(255)
);
```

## Entity Relationship Diagram (ERD)

```
users 1--1 teacher_profiles
users 1--1 parent_profiles
users 1--1 kids
parent_profiles 1--* kids
teacher_profiles 1--* courses
courses 1--* course_materials
kids *--* courses (through enrollments)
enrollments 1--* progress_logs
enrollments 1--1 course_ratings
enrollments 1--1 course_reports
course_sizes 1--* courses
```

## XP Rules

- Course XP is determined by the course size:
  - Size S: 200 XP
  - Size M: 1000 XP
  - Size L and XL: Configured in the course_sizes table

- Kids earn XP upon completion of courses or course materials
- Teachers accumulate XP based on the XP earned by kids who complete their courses

## Indices for Performance

```sql
-- User Authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Course Discovery
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_age_range ON courses(min_age, max_age);
CREATE INDEX idx_courses_activity ON courses(is_active);

-- Kid Management
CREATE INDEX idx_kids_parent_id ON kids(parent_id);
CREATE INDEX idx_kids_xp ON kids(total_xp);

-- Progress Tracking
CREATE INDEX idx_enrollments_kid_id ON enrollments(kid_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_progress_logs_enrollment_id ON progress_logs(enrollment_id);

-- Teacher Performance
CREATE INDEX idx_teacher_profiles_xp ON teacher_profiles(total_xp);
```

## Database Setup Instructions

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```
   CREATE DATABASE educational_platform;
   ```
3. Connect to the database:
   ```
   \c educational_platform
   ```
4. Run the SQL scripts to create the tables in the following order:
   - users
   - refresh_tokens, verification_documents
   - teacher_profiles, parent_profiles
   - kids
   - course_sizes
   - courses
   - course_materials
   - enrollments
   - progress_logs, course_ratings, course_reports
   - xp_titles_kids, xp_titles_teachers
   - contact_messages, notifications
5. Create indexes for performance optimization

## Development Notes

- Use prepared statements to prevent SQL injection
- Implement row-level security for multi-tenant data where applicable
- Consider using PostgreSQL triggers for maintaining updated_at timestamps
- Add database migrations for future schema changes