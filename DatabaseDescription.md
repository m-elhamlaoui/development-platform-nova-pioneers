# Minimal Educational Platform Database Schema

This document outlines an optimized PostgreSQL database schema for our educational platform, focusing only on essential data that cannot be easily calculated by the backend.

## Core Database Tables and Relationships

### Users and Authentication

#### `users` Table
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'parent', 'teacher', 'kid')),
    profile_picture VARCHAR(255), -- Stores relative path to file, not full URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255)
);
```

#### `verification_documents` Table
```sql
CREATE TABLE verification_documents (
    document_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    document_path VARCHAR(255) NOT NULL, -- Stores relative path to file, not full URL
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(user_id),
    approved_at TIMESTAMP WITH TIME ZONE
);
```

### User Extensions

#### `kids` Table
```sql
CREATE TABLE kids (
    kid_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    birth_date DATE,
    title VARCHAR(50)
    total_xp INTEGER DEFAULT 0,
    is_restricted INTEGER DEFAULT 1
);
```

#### `teachers` Table
```sql
CREATE TABLE teachers (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    certification_info VARCHAR(255),
    join_date DATE,
    accumulated_xp INTEGER DEFAULT 0,
    title VARCHAR(50)
);
```

### Courses

#### `courses` Table
```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL CHECK (LENGTH(title) BETWEEN 3 AND 100),
    description VARCHAR(1000) NOT NULL CHECK (LENGTH(description) BETWEEN 10 AND 1000),
    grade_level VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    created_date DATE,
    xp_value INTEGER NOT NULL CHECK (xp_value >= 0),
    size_category CHAR(1) NOT NULL CHECK (size_category IN ('S', 'M', 'L')),
    recommended_age INTEGER NOT NULL CHECK (recommended_age BETWEEN 4 AND 18),
    teacher_id BIGINT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);
```

#### `modules` Table
```sql
CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_order INTEGER,
    course_id BIGINT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

#### `lessons` Table
```sql
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    resource_links TEXT,
    sequence_order INTEGER,
    module_id BIGINT NOT NULL,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);
```

#### `lesson_contents` Table
```sql
CREATE TABLE lesson_contents (
    id BIGSERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    subheading VARCHAR(255),
    text TEXT,
    image_path VARCHAR(255),
    fun_fact TEXT
);
```

#### `ratings` Table
```sql
CREATE TABLE ratings (
    id BIGSERIAL PRIMARY KEY,
    rating_value INTEGER NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    comment TEXT,
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
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
    progress_percentage INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    UNIQUE(kid_id, course_id)
);
```

### Reporting

#### `course_reports` Table
```sql
CREATE TABLE course_reports (
    report_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    subject_report TEXT,
    desc_report TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
