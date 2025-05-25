# Parents & Kids API Documentation

This document outlines the API endpoints for the Parents & Kids service.

**Base URL:** `/parents-kids` (Example: `http://localhost:9000/parents-kids`)

**Authentication:** Most endpoints require a valid JWT Bearer token in the `Authorization` header. The system will infer the `user_id` and `role` from this token.

## Table of Contents
1.  [Parent Operations](#parent-operations)
2.  [Kid Operations](#kid-operations)
3.  [User (Parent/Kid) Profile Operations](#user-parentkid-profile-operations)
4.  [Course Operations (Kid-centric)](#course-operations-kid-centric)
5.  [Enrollment & Progress Operations](#enrollment--progress-operations)
6.  [Rating Operations](#rating-operations)

---

## 1. Parent Operations

These endpoints are typically accessed by users authenticated with the "parent" role. **Note:** A "parent" is a user within the `users` table with an appropriate role. The `{parentId}` in the path parameters refers to the `user_id` of this parent user.

### 1.1. Create a Kid Profile

*   **Endpoint:** `POST /parents/{parentId}/kids`
*   **Description:** Allows an authenticated parent to create a new kid profile. This will create a record in the `users` table for the kid (with `role: "kid"`) and in the `kids` table, linking back to the parent.
*   **Path Parameters:**
    *   `parentId` (integer): The `user_id` of the parent creating the kid. This *must* match the authenticated user's ID, and the user must have a "parent" role.
*   **Request Body:** `application/json`
    ```json
    {
      "email": "kiddo@example.com",
      "password": "securePassword123", // For the kid's user account
      "first_name": "Junior",
      "last_name": "Doe",
      "birth_date": "2015-06-10", // YYYY-MM-DD
      "profile_picture": "/path/to/kid_avatar.png", // Optional
      "is_restricted": false // Default could be false
    }
    ```
*   **Successful Response:** `201 Created`
    ```json
    {
      "user_id": 102, // ID from users table for the kid
      "kid_id": 5,    // ID from kids table
      "email": "kiddo@example.com",
      "first_name": "Junior",
      "last_name": "Doe",
      "role": "kid",
      "profile_picture": "/path/to/kid_avatar.png",
      "created_at": "2023-10-27T10:00:00Z",
      "is_active": true,
      "birth_date": "2015-06-10",
      "title": "Space Newby", // Initial title
      "total_xp": 0,
      "is_restricted": false,
      "parent_id": 1 // The parent_id (user_id of the parent) who created this kid
    }
    ```

### 1.2. Get All Kids for a Parent

*   **Endpoint:** `GET /parents/{parentId}/kids`
*   **Description:** Retrieves a list of all kids associated with the specified parent.
*   **Path Parameters:**
    *   `parentId` (integer): The `user_id` of the parent. This *must* match the authenticated user's ID, and the user must have a "parent" role.
*   **Successful Response:** `200 OK`
    ```json
    [
      {
        "user_id": 102,
        "kid_id": 5,
        "email": "kiddo@example.com",
        "first_name": "Junior",
        "last_name": "Doe",
        "role": "kid",
        "profile_picture": "/path/to/kid_avatar.png",
        "birth_date": "2015-06-10",
        "title": "Space Newby",
        "total_xp": 0,
        "is_restricted": false
      }
      // ... more kids
    ]
    ```

### 1.3. Update a Kid's Profile (by Parent)

*   **Endpoint:** `PUT /parents/{parentId}/kids/{kidUserId}`
*   **Description:** Allows a parent to update their kid's information. This might update both `users` and `kids` tables for the kid.
*   **Path Parameters:**
    *   `parentId` (integer): The `user_id` of the parent. This *must* match the authenticated user's ID.
    *   `kidUserId` (integer): The `user_id` of the kid (from the `users` table) to be updated. The kid must be associated with this parent.
*   **Request Body:** `application/json` (Include only fields to be updated)
    ```json
    {
      "first_name": "Junior Updated",
      "last_name": "Doe Smith",
      "birth_date": "2015-06-11",
      "profile_picture": "/path/to/new_avatar.png"
      // Password/email changes might be separate or need special handling
    }
    ```
*   **Successful Response:** `200 OK`
    ```json
    {
      "user_id": 102,
      "kid_id": 5,
      "email": "kiddo@example.com", // Assuming email not changed here
      "first_name": "Junior Updated",
      "last_name": "Doe Smith",
      "role": "kid",
      "profile_picture": "/path/to/new_avatar.png",
      "birth_date": "2015-06-11",
      "title": "Space Newby", // Title remains based on XP
      "total_xp": 0,
      "is_restricted": false // Restriction status unchanged by this call
    }
    ```

### 1.4. Toggle Kid's Restriction Status

*   **Endpoint:** `PATCH /parents/{parentId}/kids/{kidUserId}/toggle-restriction`
*   **Description:** Allows a parent to toggle the `is_restricted` status for their kid.
*   **Path Parameters:**
    *   `parentId` (integer): The `user_id` of the parent. This *must* match the authenticated user's ID.
    *   `kidUserId` (integer): The `user_id` of the kid (from the `users` table). The kid must be associated with this parent.
*   **Request Body:** `application/json`
    ```json
    {
      "is_restricted": true // or false
    }
    ```
*   **Successful Response:** `200 OK`
    ```json
    {
      "user_id": 102,
      "kid_id": 5,
      "message": "Kid's restriction status updated.",
      "is_restricted": true
    }
    ```

### 1.5. Delete a Kid Profile (Logical Delete Recommended)

*   **Endpoint:** `DELETE /parents/{parentId}/kids/{kidUserId}`
*   **Description:** Allows a parent to delete their kid's profile. Ideally, this is a logical delete (e.g., sets `is_active` to `false` in the `users` table for the kid and potentially an equivalent in `kids` or archives the kid's data).
*   **Path Parameters:**
    *   `parentId` (integer): The `user_id` of the parent. This *must* match the authenticated user's ID.
    *   `kidUserId` (integer): The `user_id` of the kid (from the `users` table) to be deleted. The kid must be associated with this parent.
*   **Successful Response:** `204 No Content` or `200 OK` with a confirmation message.
    ```json
    // If 200 OK
    {
      "message": "Kid profile for user ID 102 marked as inactive."
    }
    ```

---

## 2. Kid Operations

These endpoints are typically accessed by users with the "kid" role, referring to their own `user_id`.

### 2.1. Get Kid's Own Profile Details

*   **Endpoint:** `GET /kids/{kidUserId}/profile`
*   **Description:** Allows an authenticated kid to retrieve their own comprehensive profile details from both `users` and `kids` tables.
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid. (This should match the authenticated user's ID).
*   **Successful Response:** `200 OK`
    ```json
    {
      "user_id": 102,
      "kid_id": 5,
      "email": "kiddo@example.com",
      "first_name": "Junior",
      "last_name": "Doe",
      "role": "kid",
      "profile_picture": "/path/to/kid_avatar.png",
      "created_at": "2023-10-27T10:00:00Z",
      "is_active": true,
      "birth_date": "2015-06-10",
      "title": "Space Explorer", // Current title based on XP
      "total_xp": 250,
      "is_restricted": false,
      "parent_id": 1
    }
    ```

### 2.2. Update Kid's Own Profile (Limited Fields)

*   **Endpoint:** `PUT /kids/{kidUserId}/profile`
*   **Description:** Allows a kid to update certain parts of their own profile (e.g., `first_name`, `last_name`, `profile_picture`, potentially password). Other fields like `birth_date` or `is_restricted` are typically managed by the parent.
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid. (This should match the authenticated user's ID).
*   **Request Body:** `application/json` (Include only fields to be updated by the kid)
    ```json
    {
      "first_name": "J.R.",
      "profile_picture": "/path/to/my_new_avatar.png"
      // "password": "newStrongPassword456" // If password change is allowed
    }
    ```
*   **Successful Response:** `200 OK` (Returns the updated kid profile, similar to 2.1)
    ```json
    {
      "user_id": 102,
      "kid_id": 5,
      "email": "kiddo@example.com",
      "first_name": "J.R.", // Updated
      "last_name": "Doe",
      "role": "kid",
      "profile_picture": "/path/to/my_new_avatar.png", // Updated
      "created_at": "2023-10-27T10:00:00Z",
      "is_active": true,
      "birth_date": "2015-06-10",
      "title": "Space Explorer",
      "total_xp": 250,
      "is_restricted": false,
      "parent_id": 1
    }
    ```

---

## 3. User (Parent/Kid) Profile Operations

Generic endpoints for users to manage their own core `users` table information.

### 3.1. Get Own User Information

*   **Endpoint:** `GET /users/me`
*   **Description:** Retrieves the profile information of the currently authenticated user (Parent or Kid).
*   **Successful Response:** `200 OK`
    ```json
    // Example for a Parent
    {
      "user_id": 1,
      "email": "parent@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "parent",
      "profile_picture": "/path/to/parent_avatar.png",
      "created_at": "2023-01-15T09:00:00Z",
      "is_active": true
    }
    ```
    ```json
    // Example for a Kid
    {
      "user_id": 102,
      "email": "kiddo@example.com",
      "first_name": "Junior",
      "last_name": "Doe",
      "role": "kid",
      "profile_picture": "/path/to/kid_avatar.png",
      "created_at": "2023-10-27T10:00:00Z",
      "is_active": true
      // For kids, more details might be available via /kids/{kidUserId}/profile
    }
    ```

### 3.2. Update Own User Information

*   **Endpoint:** `PUT /users/me`
*   **Description:** Allows the authenticated user (Parent or Kid) to update their own information in the `users` table.
*   **Request Body:** `application/json`
    ```json
    {
      "first_name": "John Updated",
      "last_name": "Doe Senior",
      "profile_picture": "/path/to/new_parent_avatar.png"
      // "email": "new.email@example.com" // Email change might need verification
      // "password": "newPassword" // Password change
    }
    ```
*   **Successful Response:** `200 OK` (Returns the updated user information, similar to 3.1)

---

## 4. Course Operations (Kid-centric)

### 4.1. List Available Courses for a Kid

*   **Endpoint:** `GET /kids/{kidUserId}/courses`
*   **Description:**
    *   If the kid (`kidUserId`) is **not restricted** (`is_restricted = false`), returns all active courses.
    *   If the kid is **restricted** (`is_restricted = true`), returns only courses explicitly suggested/assigned to this kid (requires the `suggested_courses` table or similar logic).
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid viewing courses. (Authenticated kid or their parent).
*   **Query Parameters (Optional):**
    *   `grade_level` (string): Filter by grade level.
    *   `subject` (string): Filter by subject.
    *   `search` (string): Search by title or description.
*   **Successful Response:** `200 OK`
    ```json
    [
      {
        "id": 1, // Course ID
        "teacher_id": 10,
        "title": "Solar System Exploration",
        "description": "Discover the wonders of our solar system...",
        "grade_level": "Middle School",
        "subject": "Astronomy",
        "thumbnail": "/images/courses/solar_system_thumb.jpg",
        "xp_value": 250,
        "recommended_age": 11 // Single integer for recommended age
      }
      // ... more courses
    ]
    ```
    *   **Note on Restricted View:** If the kid is restricted, this list will be filtered based on a (currently conceptual) `suggested_courses` table linking `kid_id` to `course_id`. If no such table/logic exists yet, this endpoint might return an empty list or a specific message for restricted kids.

### 4.2. Get Specific Course Details

*   **Endpoint:** `GET /courses/{courseId}`
*   **Description:** Retrieves detailed information about a specific course, including its lessons and lesson contents. (Accessible to any authenticated user).
*   **Path Parameters:**
    *   `courseId` (integer): The ID of the course.
*   **Successful Response:** `200 OK`
    ```json
    {
      "id": 1, // Course ID from 'courses' table
      "teacher_id": 2, // from 'courses' table
      "teacher_name": "Dr. Astro", // Joined from 'teachers' table
      "title": "Solar System Exploration",
      "description": "Discover the wonders of our solar system and learn about the planets, moons, and other celestial bodies.",
      "grade_level": "Middle School",
      "subject": "Astronomy",
      "thumbnail": "/images/courses/solar_system_exploration_banner.jpg",
      "created_date": "2023-05-15",
      "xp_value": 250,
      "size_category": "Medium", // Full string for size category
      "recommended_age": 11, // Single integer for recommended age
      "average_rating": 4.7, // Calculated from 'ratings' table
      "lessons": [
        {
          "id": 1, // Lesson ID from 'lessons' table
          "title": "Introduction to the Solar System",
          "content": "Overview of our cosmic neighborhood and the objects it contains.",
          "resource_links": [
            "https://solarsystem.nasa.gov/",
            "https://spaceplace.nasa.gov/menu/solar-system/"
          ],
          "sequence_order": 1, // Sequence of this lesson within the course (considering module order)
          "lesson_contents": [
            {
              "id": 1, // Lesson Content ID from 'lesson_contents' table
              "subheading": "What is the Solar System?",
              "text": "Our solar system consists of the Sun, eight planets, dwarf planets, moons, asteroids, comets, and more.",
              "image_path": "/images/lessons/solar_system_overview.jpg",
              "fun_fact": "If the Sun were the size of a basketball, Earth would be the size of a pea!",
              "sequence_order": 1 // Sequence of this content within this lesson
            },
            {
              "id": 2, // Lesson Content ID
              "subheading": "The Sun: Our Star",
              "text": "The Sun is a G-type main-sequence star that contains 99.86% of the mass in the solar system.",
              "image_path": "/images/lessons/the_sun.jpg",
              "fun_fact": "The Sun produces enough energy in one second to meet Earth's power needs for almost 500,000 years.",
              "sequence_order": 2 // Sequence of this content within this lesson
            }
          ]
        },
        {
          "id": 2, // Lesson ID
          "title": "The Rocky Planets",
          "content": "Exploring Mercury, Venus, Earth, and Mars - the inner, rocky planets of our solar system.",
          "resource_links": [
            "https://science.nasa.gov/mercury/",
            "https://science.nasa.gov/venus/"
          ],
          "sequence_order": 2, // Sequence of this lesson within the course (considering module order)
          "lesson_contents": [
            {
              "id": 3, // Lesson Content ID
              "subheading": "Mercury: The Closest Planet",
              "text": "Mercury is the smallest and innermost planet in the Solar System, with extreme temperature variations.",
              "image_path": "/images/lessons/mercury.jpg",
              "fun_fact": "A day on Mercury (176 Earth days) is longer than its year (88 Earth days)!",
              "sequence_order": 1 // Sequence of this content within this lesson
            }
            // ... more lesson contents for this lesson
          ]
        }
        // ... more lessons in this course
      ]
    }
    ```

---

## 5. Enrollment & Progress Operations

These operations are primarily for kids interacting with courses.

### 5.1. Enroll a Kid in a Course

*   **Endpoint:** `POST /kids/{kidUserId}/courses/{courseId}/enroll`
*   **Description:** Allows an authenticated kid to enroll in a course. Creates an `enrollments` record.
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid enrolling. (Must match authenticated kid).
    *   `courseId` (integer): The ID of the course to enroll in.
*   **Request Body:** None
*   **Successful Response:** `201 Created`
    ```json
    {
      "enrollment_id": 25,
      "user_id": 102, // Kid's user_id
      "course_id": 1,
      "course_title": "Solar System Exploration",
      "enrolled_at": "2023-10-28T11:00:00Z",
      "completed_at": null,
      "progress_percentage": 0,
      "xp_earned": 0
    }
    ```

### 5.2. Update Enrollment Progress

*   **Endpoint:** `PUT /kids/{kidUserId}/enrollments/{enrollmentId}/progress`
*   **Description:** Enables an authenticated kid (identified by `kidUserId`) to report their progress in a specific `enrollmentId`. This can be triggered by the kid completing a lesson or a section of the course. When progress is updated, the system calculates the XP earned from this specific update, adds it to the kid's overall `total_xp` (in the `kids` table), and then re-evaluates and potentially updates the kid's `title` based on predefined XP thresholds (e.g., from 'Space Newby' to 'Space Explorer'). The `enrollments` record is also updated with the new `progress_percentage` and the cumulative `xp_earned` for that particular course enrollment. If the `progress_percentage` reaches 100, the `completed_at` timestamp for the enrollment is automatically set.
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid whose progress is being updated. (Must match authenticated kid).
    *   `enrollmentId` (integer): The ID of the enrollment record to update.
*   **Request Body:** `application/json`
    ```json
    {
      "progress_percentage": 50, // New overall progress percentage for this course enrollment
      "last_completed_lesson_id": 1 // Optional: ID of the last lesson the kid completed (using lesson.id from the course structure)
    }
    ```
*   **Successful Response:** `200 OK`
    ```json
    {
      "enrollment_id": 25,
      "user_id": 102,
      "course_id": 1,
      "course_title": "Solar System Exploration",
      "enrolled_at": "2023-10-28T11:00:00Z",
      "completed_at": null, // Would be a timestamp if progress_percentage was 100
      "progress_percentage": 50,
      "xp_earned": 125, // Cumulative XP for this enrollment (e.g., if course total XP is 250, 50% progress = 125 XP)
      "kid_profile_update": { // Reflecting changes to the kid's overall profile
          "kid_id": 5, // Kid's ID from 'kids' table
          "user_id": 102, // Kid's user_id from 'users' table
          "total_xp": 375, // Kid's new total_xp (e.g., previous_total_xp + newly_gained_xp_from_this_update)
          "title": "Space Explorer" // Kid's new title, updated if an XP threshold was crossed
      }
    }
    ```
*   **Note on XP & Title Calculation:**
    1.  The system determines the `newly_gained_xp` from this specific progress update by comparing the new `progress_percentage` to the previous one for this enrollment (or from 0% if it's the first update).
    2.  The kid's overall `total_xp` (in the `kids` table) is incremented: `kids.total_xp = kids.total_xp + newly_gained_xp`.
    3.  The kid's `title` (in the `kids` table) is re-evaluated based on the updated `kids.total_xp` and predefined XP thresholds.
    4.  The `enrollments.xp_earned` field is updated to reflect the total cumulative XP earned for this specific course enrollment so far (i.e., `course.xp_value * progress_percentage / 100`).
    5.  If `progress_percentage` reaches 100, `enrollments.completed_at` is set to the current timestamp, signifying course completion for this enrollment.

### 5.3. Get Kid's Enrollments

*   **Endpoint:** `GET /kids/{kidUserId}/enrollments`
*   **Description:** Retrieves all course enrollments for a specific kid.
*   **Path Parameters:**
    *   `kidUserId` (integer): The `user_id` of the kid. (Authenticated kid or their parent).
*   **Successful Response:** `200 OK`
    ```json
    [
      {
        "enrollment_id": 25,
        "user_id": 102,
        "course_id": 1,
        "course_title": "Solar System Exploration",
        "course_thumbnail": "/images/courses/solar_system_thumb.jpg",
        "enrolled_at": "2023-10-28T11:00:00Z",
        "completed_at": null,
        "progress_percentage": 50,
        "xp_earned": 125
      }
      // ... more enrollments
    ]
    ```

---

## 6. Rating Operations

Accessible by any authenticated user (Parent or Kid) who has interacted with or viewed a course. The `user_type` in the `ratings` table can be inferred from the user's role.

### 6.1. Rate a Course

*   **Endpoint:** `POST /courses/{courseId}/ratings`
*   **Description:** Allows an authenticated user (Parent or Kid) to submit a rating for a course. The `user_id` and `user_type` (e.g., "parent", "kid") are derived from the authenticated user.
*   **Path Parameters:**
    *   `courseId` (integer): The ID of the course to be rated.
*   **Request Body:** `application/json`
    ```json
    {
      "rating_value": 5, // Integer from 1 to 5
      "comment": "This course was amazing and very engaging!" // Optional
    }
    ```
*   **Successful Response:** `201 Created`
    ```json
    {
      "id": 7, // Rating ID
      "rating_value": 5,
      "comment": "This course was amazing and very engaging!",
      "course_id": 1,
      "user_id": 102, // ID of the user who submitted the rating
      "user_type": "kid", // Or "parent"
      "rated_at": "2023-10-28T14:30:00Z" // Timestamp of rating submission
    }
    ```

### 6.2. Get Ratings for a Course

*   **Endpoint:** `GET /courses/{courseId}/ratings`
*   **Description:** Retrieves all ratings for a specific course.
*   **Path Parameters:**
    *   `courseId` (integer): The ID of the course.
*   **Query Parameters (Optional):**
    *   `page` (integer, default: 0)
    *   `size` (integer, default: 10)
*   **Successful Response:** `200 OK`
    ```json
    {
      "average_rating": 4.5,
      "total_ratings": 20,
      "ratings": [
        {
          "id": 7,
          "rating_value": 5,
          "comment": "This course was amazing and very engaging!",
          "user_id": 102,
          "user_first_name": "Junior", // Optionally join user's first name
          "user_type": "kid",
          "rated_at": "2023-10-28T14:30:00Z"
        }
        // ... more ratings
      ],
      "page_info": {
        "current_page": 0,
        "total_pages": 2,
        "page_size": 10,
        "total_elements": 20
      }
    }
    ```

---