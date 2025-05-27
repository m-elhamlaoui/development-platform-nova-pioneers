# Admin Service API Documentation

## Overview
The Admin Service provides administrative functionality for the Nova Pioneers platform, including user management and teacher approval workflows.

**Base URL**: `http://localhost:9091`

## Authentication
Currently, all endpoints are publicly accessible (CORS enabled, no authentication required).

## Endpoints

### 1. Health Check

#### Test Endpoint
**GET** `/api/test`

**Description**: Basic health check endpoint to verify the service is running.

**Response**:
```
Admin Service Working
```

---

### 2. User Management

#### Create User
**POST** `/api/admin/create-user`

**Description**: Creates a new user with hashed password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "plainTextPassword",
  "role": "teacher|student|parent|admin",
  "isActive": true
}
```

**Response** (201 Created):
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "teacher",
  "isActive": true,
  "createdAt": "2025-05-27T10:30:00"
}
```

**Error Response** (400 Bad Request):
- User with email already exists

---

#### Create Admin
**POST** `/api/admin/create-admin`

**Description**: Creates a new admin user (automatically sets role to "admin" and isActive to true).

**Request Body**:
```json
{
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "password": "adminPassword"
}
```

**Response** (201 Created):
```json
{
  "userId": 2,
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-05-27T10:30:00"
}
```

**Error Response** (400 Bad Request):
- User with email already exists

---

### 3. Teacher Approval Workflow

#### Get Pending Teachers
**GET** `/api/admin/teachers/pending`

**Description**: Retrieves all users with role "teacher" and isActive set to false (pending approval).

**Response** (200 OK):
```json
[
  {
    "userId": 3,
    "email": "teacher1@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "createdAt": "2025-05-27T09:15:00"
  },
  {
    "userId": 4,
    "email": "teacher2@example.com",
    "firstName": "Bob",
    "lastName": "Johnson",
    "createdAt": "2025-05-27T08:45:00"
  }
]
```

**Response** (200 OK - Empty):
```json
[]
```

**Error Response** (500 Internal Server Error):
- Database connection issues

---

#### Approve Teacher
**POST** `/api/admin/teachers/approve/{userId}`

**Description**: Approves a pending teacher by:
1. Setting user's isActive to true
2. Creating a new record in the teachers table
3. Auto-generating username and setting default values

**Path Parameters**:
- `userId` (Long): The ID of the user to approve

**Request Body**:
```json
{
  "certificationInfo": "Java Spring Boot Certified, 5 years experience in web development",
  "title": "Expert"
}
```

**Request Body Fields**:
- `certificationInfo` (String, optional): Teacher's certification details
- `title` (String, optional): Teacher's title (defaults to "Beginner" if not provided)

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "jane_smith",
  "email": "teacher1@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "userId": 3,
  "certificationInfo": "Java Spring Boot Certified, 5 years experience in web development",
  "joinDate": "2025-05-27",
  "accumulatedXp": 0,
  "title": "Expert"
}
```

**Error Responses**:

**400 Bad Request**:
- User not found with the provided ID
- User is not a pending teacher (wrong role or already active)
- Teacher already exists in teachers table

**500 Internal Server Error**:
- Database transaction issues

---

## Data Models

### User Entity
```json
{
  "userId": "Long (Primary Key, Auto-generated)",
  "email": "String (Unique)",
  "firstName": "String",
  "lastName": "String", 
  "passwordHash": "String (BCrypt hashed)",
  "role": "String (teacher|student|parent|admin)",
  "isActive": "Boolean",
  "createdAt": "LocalDateTime (Auto-generated)",
  "oauthId": "String (Optional)",
  "oauthProvider": "String (Optional)",
  "profilePicture": "String (Optional)"
}
```

### Teacher Entity
```json
{
  "id": "Long (Primary Key, Auto-generated)",
  "userId": "Integer (Foreign Key to User)",
  "username": "String (Auto-generated from first/last name)",
  "email": "String",
  "firstName": "String", 
  "lastName": "String",
  "certificationInfo": "String (Optional)",
  "joinDate": "LocalDate (Auto-generated)",
  "accumulatedXp": "Integer (Default: 0)",
  "title": "String (Default: 'Beginner')"
}
```

## Error Handling

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or business logic violation
- **500 Internal Server Error**: Server-side error

### Error Response Format
For endpoints that return errors, the response body will be empty, and the error information is conveyed through the HTTP status code.

## Development Notes

### Database Configuration
- Uses PostgreSQL database
- JPA/Hibernate for ORM
- Auto-generated timestamps and IDs

### Security Configuration
- CORS enabled for development origins
- CSRF disabled
- All endpoints currently permit all requests
- Passwords are hashed using BCrypt

### Business Logic
- Username generation: `firstName_lastName` (lowercase, special characters removed)
- Teacher approval creates entries in both `users` and `teachers` tables
- Default values: XP = 0, title = "Beginner", joinDate = current date

## Example Usage

### Complete Teacher Approval Flow

1. **Check pending teachers**:
```bash
GET /api/admin/teachers/pending
```

2. **Approve a teacher**:
```bash
POST /api/admin/teachers/approve/3
Content-Type: application/json

{
  "certificationInfo": "Computer Science Degree, 3 years teaching experience",
  "title": "Intermediate"
}
```

### Create Admin User

```bash
POST /api/admin/create-admin
Content-Type: application/json

{
  "email": "admin@novapioneers.com",
  "firstName": "System",
  "lastName": "Administrator", 
  "password": "secureAdminPassword123"
}
```