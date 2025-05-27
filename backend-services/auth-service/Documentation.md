# Nova Pioneers Auth API Quick Reference

## Base URL
`http://localhost:9092`

## Authentication
Protected endpoints require JWT:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Register Parent
`POST /signup/parent`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
Response: `200 OK` with userId and success message

### 2. Register Teacher
`POST /signup/teacher`  
Content-Type: `multipart/form-data`
- `firstName`: string
- `lastName`: string
- `email`: string
- `password`: string
- `document`: file (certification)

Response: `200 OK` with userId and "pending review" message

### 3. Sign In
`POST /auth/signin`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "parent",
  "token": "eyJhbGciOiJ..."
}
```

### 4. Validate Token
`POST /token/validate`
```json
{
  "token": "eyJhbGciOiJ..."
}
```
Response: `{"valid": true}` or `{"valid": false}`

### 5. Logout (Revoke Token)
`POST /token/revoke`  
Headers: `Authorization: Bearer <token>`
```json
{
  "token": "eyJhbGciOiJ..."
}
```
Response: `{"revoked": true}`

## Implementation Notes
- Store token in localStorage/sessionStorage
- Include token in all API requests after login
- Teacher accounts require admin approval
- Tokens expire after 24 hours
- Login automatically invalidates all previous tokens

