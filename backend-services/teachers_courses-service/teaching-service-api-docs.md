mi# Teaching Service API Documentation

## Base URL
```
http://localhost:8080/api
```

## Table of Contents
- [Teachers API](#teachers-api)
- [Courses API](#courses-api)
- [Modules API](#modules-api)
- [Lessons API](#lessons-api)
- [Ratings API](#ratings-api)
- [Test Endpoint](#test-endpoint)

---

## Teachers API

### **1. Get All Teachers**
`GET /api/teachers`

**Description:** Retrieves a list of all teachers in the system.

**Response:**
```json
[
  {
    "id": 1,
    "username": "teacher123",
    "email": "teacher@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "certificationInfo": "PhD in Education",
    "joinDate": "2024-01-15",
    "accumulatedXp": 1500,
    "title": "Super Teacher"
  }
]
```
**Status:** `200 OK`

---

### **2. Get Teacher by ID**
`GET /api/teachers/{id}`

**Description:** Retrieves a specific teacher by their ID.

**Path Parameters:**
- `id` (Long) - Teacher ID

**Response:**
```json
{
  "id": 1,
  "username": "teacher123",
  "email": "teacher@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "certificationInfo": "PhD in Education",
  "joinDate": "2024-01-15",
  "accumulatedXp": 1500,
  "title": "Super Teacher"
}
```
**Status:** 
- `200 OK` - Teacher found
- `404 Not Found` - Teacher not found

---

### **3. Create Teacher**
`POST /api/teachers`

**Description:** Creates a new teacher account.

**Request Body:**
```json
{
  "username": "newteacher",
  "email": "newteacher@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "certificationInfo": "MSc in Physics",
  "joinDate": "2024-05-22"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "newteacher",
  "email": "newteacher@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "certificationInfo": "MSc in Physics",
  "joinDate": "2024-05-22",
  "accumulatedXp": 0,
  "title": "Beginner Teacher"
}
```
**Status:** `201 Created`

---

### **4. Update Teacher**
`PUT /api/teachers/{id}`

**Description:** Updates an existing teacher's information.

**Path Parameters:**
- `id` (Long) - Teacher ID

**Request Body:**
```json
{
  "username": "updatedteacher",
  "email": "updated@example.com",
  "firstName": "John",
  "lastName": "Updated",
  "certificationInfo": "PhD in Astrophysics",
  "title": "Great Teacher"
}
```

**Response:** Updated teacher object
**Status:** 
- `200 OK` - Update successful
- `404 Not Found` - Teacher not found

---

### **5. Add XP to Teacher**
`POST /api/teachers/{id}/add-xp?xp={amount}`

**Description:** Adds experience points to a teacher's account.

**Path Parameters:**
- `id` (Long) - Teacher ID

**Query Parameters:**
- `xp` (int) - Amount of XP to add

**Response:** Empty body
**Status:** 
- `200 OK` - XP added successfully
- `404 Not Found` - Teacher not found

---

## Courses API

### **1. Get All Courses**
`GET /api/courses`

**Description:** Retrieves all courses (basic information).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Our Amazing Galaxy",
    "description": "Learn about galaxies in a fun way!",
    "gradeLevel": "Elementary",
    "subject": "Astronomy",
    "createdDate": "2024-03-01",
    "xpValue": 500,
    "sizeCategory": "M",
    "recommendedAge": 8,
    "teacherId": 1
  }
]
```
**Status:** `200 OK`

---

### **2. Get All Courses (Detailed)**
`GET /api/courses/detailed`

**Description:** Retrieves all courses with complete details including lessons and content.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Our Amazing Galaxy",
    "description": "Learn about galaxies in a fun way!",
    "gradeLevel": "Elementary",
    "subject": "Astronomy",
    "createdDate": "2024-03-01",
    "xpValue": 500,
    "sizeCategory": "M",
    "recommendedAge": 8,
    "teacherId": 1,
    "lessons": [
      {
        "id": 1,
        "title": "Introduction to Galaxies",
        "content": [
          {
            "subheading": "What is a Galaxy?",
            "text": "A galaxy is a huge collection of stars...",
            "funFact": "Our galaxy has billions of stars!"
          }
        ],
        "resourceLinks": "https://nasa.gov/galaxies",
        "sequenceOrder": 1
      }
    ]
  }
]
```
**Status:** `200 OK`

---

### **3. Get Course by ID**
`GET /api/courses/{id}`

**Description:** Retrieves a specific course by ID (basic information).

**Path Parameters:**
- `id` (Long) - Course ID

**Status:** 
- `200 OK` - Course found
- `404 Not Found` - Course not found

---

### **4. Get Course by ID (Detailed)**
`GET /api/courses/{id}/detailed`

**Description:** Retrieves a specific course with complete details.

**Path Parameters:**
- `id` (Long) - Course ID

**Status:** 
- `200 OK` - Course found
- `404 Not Found` - Course not found

---

### **5. Get Courses by Teacher**
`GET /api/courses/teacher/{teacherId}`

**Description:** Retrieves all courses created by a specific teacher.

**Path Parameters:**
- `teacherId` (Long) - Teacher ID

**Status:** `200 OK`

---

### **6. Get Courses by Teacher (Detailed)**
`GET /api/courses/teacher/{teacherId}/detailed`

**Description:** Retrieves all courses by a teacher with complete details.

**Path Parameters:**
- `teacherId` (Long) - Teacher ID

**Status:** `200 OK`

---

### **7. Create Course**
`POST /api/courses`

**Description:** Creates a new course (basic).

**Request Body:**
```json
{
  "title": "Space Adventures",
  "description": "An exciting journey through space for kids!",
  "gradeLevel": "Elementary",
  "subject": "Space Science",
  "xpValue": 1000,
  "sizeCategory": "L",
  "recommendedAge": 10,
  "teacherId": 1
}
```

**Response:** Created course object
**Status:** `201 Created`

**Validation Rules:**
- `title`: 3-100 characters
- `description`: 10-1000 characters
- `sizeCategory`: Must be 'S', 'M', or 'L'
- `recommendedAge`: Between 4 and 18
- `xpValue`: Must be >= 0

---

### **8. Create Course (Detailed)**
`POST /api/courses/detailed`

**Description:** Creates a new course with lessons and content sections.

**Request Body:**
```json
{
  "title": "Space Adventures",
  "description": "An exciting journey through space for kids!",
  "gradeLevel": "Elementary",
  "subject": "Space Science",
  "xpValue": 1000,
  "sizeCategory": "L",
  "recommendedAge": 10,
  "teacherId": 1,
  "lessons": [
    {
      "title": "The Solar System",
      "content": [
        {
          "subheading": "Our Sun",
          "text": "The Sun is a star at the center of our solar system...",
          "funFact": "The Sun is so big that 1 million Earths could fit inside!"
        }
      ],
      "resourceLinks": "https://example.com/solar-system",
      "sequenceOrder": 1
    }
  ]
}
```

**Response:** Created course with all details
**Status:** `201 Created`

---

### **9. Update Course**
`PUT /api/courses/{id}`

**Description:** Updates an existing course (basic).

**Path Parameters:**
- `id` (Long) - Course ID

**Request Body:** Same as create course

**Status:** 
- `200 OK` - Update successful
- `404 Not Found` - Course not found

---

### **10. Update Course (Detailed)**
`PUT /api/courses/{id}/detailed`

**Description:** Updates a course with all its details.

**Path Parameters:**
- `id` (Long) - Course ID

**Request Body:** Same as create course detailed

**Status:** 
- `200 OK` - Update successful
- `404 Not Found` - Course not found

---

### **11. Delete Course**
`DELETE /api/courses/{id}`

**Description:** Deletes a course and all its associated modules, lessons, and ratings.

**Path Parameters:**
- `id` (Long) - Course ID

**Status:** 
- `204 No Content` - Delete successful
- `404 Not Found` - Course not found

---

### **12. Search Courses**
`GET /api/courses/search?keyword={keyword}`

**Description:** Searches courses by keyword in title or description.

**Query Parameters:**
- `keyword` (String) - Search term

**Response:** Array of matching courses
**Status:** `200 OK`

---

### **13. Filter Courses**
`GET /api/courses/filter`

**Description:** Filters courses based on multiple criteria.

**Query Parameters (all optional):**
- `subject` (String) - Subject area
- `gradeLevel` (String) - Grade level
- `sizeCategory` (String) - Size category (S/M/L)
- `minAge` (Integer) - Minimum recommended age
- `maxAge` (Integer) - Maximum recommended age

**Example:**
```
GET /api/courses/filter?subject=Astronomy&minAge=6&maxAge=12
```

**Response:** Array of filtered courses
**Status:** `200 OK`

---

## Modules API

### **1. Get Modules by Course**
`GET /api/courses/{courseId}/modules`

**Description:** Retrieves all modules for a specific course.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Response:**
```json
[
  {
    "id": 1,
    "title": "Introduction to Space",
    "description": "Basic concepts about space",
    "sequenceOrder": 1,
    "courseId": 1
  }
]
```
**Status:** `200 OK`

---

### **2. Get Module by ID**
`GET /api/courses/{courseId}/modules/{id}`

**Description:** Retrieves a specific module.

**Path Parameters:**
- `courseId` (Long) - Course ID
- `id` (Long) - Module ID

**Status:** 
- `200 OK` - Module found
- `404 Not Found` - Module not found

---

### **3. Create Module**
`POST /api/courses/{courseId}/modules`

**Description:** Creates a new module for a course.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Request Body:**
```json
{
  "title": "Planets and Moons",
  "description": "Learn about planets and their moons",
  "sequenceOrder": 2
}
```

**Response:** Created module object
**Status:** `201 Created`

---

### **4. Update Module**
`PUT /api/courses/{courseId}/modules/{id}`

**Description:** Updates an existing module.

**Path Parameters:**
- `courseId` (Long) - Course ID
- `id` (Long) - Module ID

**Request Body:** Same as create module

**Status:** 
- `200 OK` - Update successful
- `404 Not Found` - Module not found

---

### **5. Delete Module**
`DELETE /api/courses/{courseId}/modules/{id}`

**Description:** Deletes a module and all its lessons.

**Path Parameters:**
- `courseId` (Long) - Course ID
- `id` (Long) - Module ID

**Status:** `204 No Content`

---

## Lessons API

### **1. Get Lessons by Module**
`GET /api/modules/{moduleId}/lessons`

**Description:** Retrieves all lessons for a specific module.

**Path Parameters:**
- `moduleId` (Long) - Module ID

**Response:**
```json
[
  {
    "id": 1,
    "title": "What are Stars?",
    "content": "Stars are giant balls of hot gas...",
    "resourceLinks": "https://example.com/stars",
    "sequenceOrder": 1,
    "moduleId": 1
  }
]
```
**Status:** `200 OK`

---

### **2. Get Lesson by ID**
`GET /api/modules/{moduleId}/lessons/{id}`

**Description:** Retrieves a specific lesson.

**Path Parameters:**
- `moduleId` (Long) - Module ID
- `id` (Long) - Lesson ID

**Status:** 
- `200 OK` - Lesson found
- `404 Not Found` - Lesson not found

---

### **3. Create Lesson for Module**
`POST /api/modules/{moduleId}/lessons`

**Description:** Creates a new lesson for a module.

**Path Parameters:**
- `moduleId` (Long) - Module ID

**Request Body:**
```json
{
  "title": "The Life of a Star",
  "content": "Stars are born in nebulae...",
  "resourceLinks": "https://example.com/star-life",
  "sequenceOrder": 2
}
```

**Response:** Created lesson object
**Status:** `201 Created`

---

### **4. Get Lessons by Course**
`GET /api/modules/courses/{courseId}/lessons`

**Description:** Retrieves all lessons for a specific course.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Status:** `200 OK`

---

### **5. Get Lessons by Course (Detailed)**
`GET /api/modules/courses/{courseId}/lessons/detailed`

**Description:** Retrieves all lessons for a course with content sections.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Response:**
```json
[
  {
    "id": 1,
    "title": "Introduction to Galaxies",
    "content": [
      {
        "subheading": "What is a Galaxy?",
        "text": "A galaxy is a huge collection of stars...",
        "funFact": "Our galaxy has billions of stars!"
      }
    ],
    "resourceLinks": "https://nasa.gov/galaxies",
    "sequenceOrder": 1
  }
]
```
**Status:** `200 OK`

---

### **6. Create Lesson for Course**
`POST /api/modules/courses/{courseId}/lessons`

**Description:** Creates a lesson directly for a course (without specifying module).

**Path Parameters:**
- `courseId` (Long) - Course ID

**Request Body:** Same as create lesson for module

**Status:** `201 Created`

---

### **7. Update Lesson**
`PUT /api/modules/{moduleId}/lessons/{id}`

**Description:** Updates an existing lesson.

**Path Parameters:**
- `moduleId` (Long) - Module ID
- `id` (Long) - Lesson ID

**Request Body:** Same as create lesson

**Status:** 
- `200 OK` - Update successful
- `404 Not Found` - Lesson not found

---

### **8. Delete Lesson**
`DELETE /api/modules/{moduleId}/lessons/{id}`

**Description:** Deletes a lesson.

**Path Parameters:**
- `moduleId` (Long) - Module ID
- `id` (Long) - Lesson ID

**Status:** `204 No Content`

---

## Ratings API

### **1. Get Ratings by Course**
`GET /api/courses/{courseId}/ratings`

**Description:** Retrieves all ratings for a specific course.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Response:**
```json
[
  {
    "id": 1,
    "ratingValue": 5,
    "comment": "My kid loves this course! Very engaging!",
    "courseId": 1,
    "userId": 123,
    "userType": "parent"
  }
]
```
**Status:** `200 OK`

---

### **2. Add Rating**
`POST /api/courses/{courseId}/ratings`

**Description:** Adds a new rating to a course.

**Path Parameters:**
- `courseId` (Long) - Course ID

**Request Body:**
```json
{
  "ratingValue": 4,
  "comment": "Great course, but could use more interactive elements",
  "userId": 456,
  "userType": "kid"
}
```

**Response:** Created rating object
**Status:** `201 Created`

**Validation Rules:**
- `ratingValue`: Must be between 1 and 5

---

### **3. Delete Rating**
`DELETE /api/courses/{courseId}/ratings/{ratingId}`

**Description:** Deletes a rating.

**Path Parameters:**
- `courseId` (Long) - Course ID
- `ratingId` (Long) - Rating ID

**Status:** `204 No Content`

---

## Test Endpoint

### **Test Service**
`GET /api/test`

**Description:** Simple endpoint to verify the Teaching Service is running.

**Response:**
```
"Teaching Service Working"
```
**Status:** `200 OK`

---

## Error Responses

All endpoints may return the following error responses:

### **400 Bad Request**
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": {
    "title": "Title must be between 3 and 100 characters"
  }
}
```

### **404 Not Found**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Data Types

### ContentSectionDTO
```json
{
  "subheading": "string",
  "text": "string",
  "funFact": "string (optional)"
}
```

### LessonDTO
```json
{
  "id": "number",
  "title": "string",
  "content": ["ContentSectionDTO"],
  "resourceLinks": "string",
  "sequenceOrder": "number"
}
```

### CourseDTO
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "gradeLevel": "string",
  "subject": "string",
  "createdDate": "date",
  "xpValue": "number",
  "sizeCategory": "string (S/M/L)",
  "recommendedAge": "number",
  "teacherId": "number",
  "lessons": ["LessonDTO"]
}
```