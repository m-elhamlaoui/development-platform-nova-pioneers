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

#### `user_profile` Table
```sql
CREATE TABLE user_profile (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    specialty VARCHAR(100),
    experience_years INTEGER,
    total_xp INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE
);
```

#### `kids` Table
```sql
CREATE TABLE kids (
    kid_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    birth_date DATE,
    total_xp INTEGER DEFAULT 0
);
```

### Courses and Categories

#### `categories` Table
```sql
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_path VARCHAR(255) -- Stores relative path to file, not full URL
);
```

#### `courses` Table
```sql
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_path VARCHAR(255), -- Stores relative path to file, not full URL
    size_code CHAR(1) NOT NULL CHECK (size_code IN ('S', 'M', 'L', 'XL')),
    xp_reward INTEGER NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### `course_materials` Table
```sql
CREATE TABLE course_materials (
    material_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(255), -- Stores relative path to file, not full URL
    material_type VARCHAR(50) NOT NULL,
    order_index INTEGER
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

#### `progress_logs` Table
```sql
CREATE TABLE progress_logs (
    log_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES course_materials(material_id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `course_reports` Table
```sql
CREATE TABLE course_reports (
    report_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    teacher_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### XP Title Reference Tables 
```sql
CREATE TABLE xp_titles (
    title_id SERIAL PRIMARY KEY,
    title_name VARCHAR(50) NOT NULL,
    min_xp_required INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('kid', 'teacher')),
    badge_path VARCHAR(255), -- Stores relative path to file, not full URL
    UNIQUE(title_name, role)
);
```

### Contact System

#### `contact_messages` Table
```sql
CREATE TABLE contact_messages (
    message_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);
```

## Entity Relationship Diagram (ERD)

```
users 1--1 user_profile
users 1--* kids (parent relationship)
users 1--* courses (teacher relationship)
categories 1--* courses
courses 1--* course_materials
kids *--* courses (through enrollments)
enrollments 1--* progress_logs
enrollments 1--1 course_ratings
enrollments 1--1 course_reports
```

## Backend-Calculated Values

The following information doesn't need to be stored and can be calculated by the backend:

1. **User Titles** - Based on XP and the xp_titles reference table
2. **Teacher Titles** - Based on XP and the xp_titles reference table  
3. **Age** - Calculated from birth_date
4. **Course size XP rules** - Can be implemented in business logic:
   - Size S: 200 XP
   - Size M: 1000 XP
   - Larger sizes determined by business rules
5. **Last login time** - Tracked in the authentication service, not needed in DB
6. **Profile verification status** - Derived from approved verification documents

## Essential Indices

```sql
-- User Authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Course Discovery
CREATE INDEX idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_courses_age_range ON courses(min_age, max_age);

-- Kid Management
CREATE INDEX idx_kids_parent_id ON kids(parent_id);

-- Progress Tracking
CREATE INDEX idx_enrollments_kid_id ON enrollments(kid_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
```

## Implementation Notes

1. **File Storage Approach**:
   - All uploaded files are stored in the server's filesystem
   - Only the relative file paths are stored in the database for efficiency
   - The backend service constructs full URLs when needed by combining the server base URL with the file paths
   - Standardized file path format: `/uploads/{content_type}/{user_id}/{filename}`
   - Example: `/uploads/profiles/42/profile.jpg` or `/uploads/courses/15/thumbnail.png`

2. **XP Calculation**:
   - Kid XP is updated in the kids table when courses are completed
   - Teacher XP is updated when a kid completes a teacher's course

2. **Title Assignment**:
   - The backend queries the xp_titles table with a user's role and XP to determine their current title
   - No need to store the current title in the user tables

3. **Age-based Logic**:
   - Calculate age on-the-fly from kid's birth_date

4. **Notifications**:
   - Implement as a separate microservice rather than in the database
   - Use a messaging queue for real-time notifications

5. **Session Management**:
   - Handle with JWT tokens, no need for a refresh_tokens table unless you need persistent sessions

This minimalist schema focuses on storing only essential data while allowing the backend services to handle derived values and business logic.