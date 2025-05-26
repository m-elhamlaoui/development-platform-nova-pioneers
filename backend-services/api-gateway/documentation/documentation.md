# Nova Pioneers API Gateway Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Request Flow](#request-flow)
- [Authentication & Authorization](#authentication--authorization)
- [Security Rules](#security-rules)
- [CORS Configuration](#cors-configuration)
- [Components](#components)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Nova Pioneers API Gateway is a **stateless, reactive gateway** built with Spring Cloud Gateway that serves as the single entry point for all client requests to the microservices ecosystem.

### Key Responsibilities:
- **Request Routing**: Routes incoming requests to appropriate backend services
- **Authentication**: Validates JWT tokens without database lookups
- **Authorization**: Enforces role-based access control using YAML-defined rules
- **CORS Handling**: Manages cross-origin requests for web frontend
- **Request Enhancement**: Adds user context headers for downstream services

### Architecture Principles:
- **Stateless**: No database dependencies, all state in JWT tokens
- **Reactive**: Built on Spring WebFlux for high performance
- **Configuration-Driven**: Security rules defined in YAML files
- **Microservices-Ready**: Routes to multiple backend services

---

## Architecture

```plantuml
@startuml
!theme plain
skinparam componentStyle rectangle

actor "Frontend\n(React)" as Frontend
component "API Gateway\n:9000" as Gateway {
  component "CORS Filter" as CORS
  component "JWT Auth Filter" as JWT
  component "Security Rules" as Rules
  component "Route Locator" as Router
}

component "Auth Service\n:9092" as Auth
component "Admin Service\n:9091" as Admin  
component "Parents-Kids Service\n:9093" as Parents
component "Teachers-Courses Service\n:9094" as Teachers

Frontend --> Gateway : HTTP Requests\nAuthorization: Bearer <JWT>

Gateway --> CORS : 1. CORS Check
CORS --> JWT : 2. JWT Validation
JWT --> Rules : 3. Security Rules
Rules --> Router : 4. Route Request
Router --> Auth : /auth/**
Router --> Admin : /admin/**
Router --> Parents : /parents-kids/**
Router --> Teachers : /teachers-courses/**

note right of Gateway
  Stateless Gateway
  - No Database Connection
  - JWT Signature Validation Only
  - Security Rules from YAML
end note

note bottom of Auth
  Handles:
  - User Registration
  - Login/Logout  
  - JWT Token Creation
  - Token Storage & Revocation
end note

@enduml
```

---

## Request Flow

### Detailed Request Processing Flow:

```plantuml
@startuml
!theme plain
skinparam backgroundColor white

participant "Frontend" as F
participant "CORS Filter" as C
participant "JWT Auth Filter" as J
participant "Security Rules" as S
participant "Route Locator" as R
participant "Backend Service" as B

F -> C: HTTP Request\nAuthorization: Bearer <JWT>
activate C

C -> C: Check CORS Policy
alt CORS Allowed
  C -> J: Continue Processing
  activate J
  
  J -> J: Extract JWT from\nAuthorization Header
  
  alt JWT Present
    J -> J: Validate JWT Signature\n& Expiration
    
    alt JWT Valid
      J -> J: Extract User Info:\n- User ID\n- Role\n- Username
      
      J -> S: Check Access Permissions\nrequestrAuthentication(path, method)\nisAccessAllowed(path, method, role)
      activate S
      
      S -> S: Load Security Rules\nfrom YAML files
      S -> S: Match Request Path\nto Security Patterns
      
      alt Access Allowed
        S --> J: Access Granted
        deactivate S
        
        J -> J: Add Headers:\nX-User-Id: 123\nX-User-Role: parent\nX-Username: john@email.com
        
        J -> R: Forward Enhanced Request
        activate R
        
        R -> R: Match Route Pattern:\n/parents-kids/** → parents-kids-service
        R -> R: Apply Filters:\nStripPrefix(1)
        
        R -> B: Route to Backend\n/parents-kids/users/me → /users/me
        activate B
        
        B -> B: Process Request\nUsing X-User-* Headers
        B --> R: Response
        deactivate B
        
        R --> J: Response
        deactivate R
        
        J --> C: Response
        deactivate J
        
        C --> F: Final Response
        deactivate C
        
      else Access Denied
        S --> J: 403 Forbidden
        deactivate S
        J --> C: Error Response
        deactivate J
        C --> F: 403 Forbidden
        deactivate C
      end
      
    else JWT Invalid
      J --> C: 401 Unauthorized
      deactivate J
      C --> F: 401 Unauthorized  
      deactivate C
    end
    
  else No JWT & Protected Endpoint
    J --> C: 401 Unauthorized
    deactivate J
    C --> F: 401 Unauthorized
    deactivate C
  end
  
else CORS Blocked
  C --> F: CORS Error
  deactivate C
end

@enduml
```

---

## Authentication & Authorization

### JWT Token Validation Process

The gateway uses **stateless JWT validation** - no database lookups required:

#### 1. **Token Extraction**
```java
// From Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...
String token = authHeader.substring(7); // Remove "Bearer " prefix
```

#### 2. **Signature Validation**
```java
Claims claims = Jwts.parser()
    .verifyWith(secretKey)  // Verify with shared secret
    .build()
    .parseSignedClaims(token)
    .getPayload();
```

#### 3. **User Info Extraction**
```java
String username = claims.getSubject();           // john.doe@email.com
String role = claims.get("role", String.class);  // "parent"
Long userId = claims.get("userId", Long.class);  // 123
```

#### 4. **Request Enhancement**
Gateway adds headers for downstream services:
```http
X-User-Id: 123
X-User-Role: parent  
X-Username: john.doe@email.com
```

### JWT Token Structure

```json
{
  "sub": "john.doe@email.com",
  "userId": 123,
  "role": "parent",
  "iat": 1640995200,
  "exp": 1641081600
}
```

---

## Security Rules

### Rule-Based Access Control

Security rules are defined in YAML files under `src/main/resources/security/`:

```
security/
├── admin-service-security.yml
├── auth-service-security.yml  
├── parents-kids-service-security.yml
└── teachers-courses-service-security.yml
```

### Rule Structure

```yaml
paths:
  - pattern: "/parents-kids/users/me"
    authenticated: true
    # No roles = any authenticated user
    
  - pattern: "/parents-kids/parents/*/kids"
    roles: ["parent", "admin"]
    authenticated: true
    
  - pattern: "/teachers-courses/api/courses"
    authenticated: false
    methods: ["GET"]
    # Public course browsing
```

### Rule Matching Algorithm

```plantuml
@startuml
!theme plain

start

:Incoming Request\n/parents-kids/users/me;

:Extract Service\nfrom Path;
note right: /parents-kids → parents-kids-service

:Load Security Rules\nfor Service;

:Find All Matching\nRule Patterns;

if (Multiple Rules Match?) then (yes)
  :Calculate Specificity Score\nfor Each Rule;
  note right
    More specific patterns win:
    - Longer patterns = higher score
    - Fewer wildcards = higher score
  end note
  :Select Most Specific Rule;
else (no)
  :Use Single Matching Rule;
endif

if (Rule Found?) then (yes)
  :Apply Rule;
  if (Authentication Required?) then (yes)
    if (Valid JWT?) then (yes)
      if (Role Allowed?) then (yes)
        :Allow Request;
      else (no)
        :Return 403 Forbidden;
      endif
    else (no)
      :Return 401 Unauthorized;
    endif
  else (no)
    :Allow Request;
  endif
else (no)
  :Default: Deny Access;
  :Return 403 Forbidden;
endif

stop

@enduml
```

### Rule Specificity Examples

```yaml
# More specific rules override general ones
paths:
  # Specific rule - matches exactly
  - pattern: "/parents-kids/users/me"
    authenticated: true
    
  # General rule - matches many paths  
  - pattern: "/parents-kids/**"
    roles: ["parent", "admin"]
    authenticated: true
```

**Request**: `GET /parents-kids/users/me`
**Result**: First rule wins (more specific)

---

## CORS Configuration

### Cross-Origin Resource Sharing Setup

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow frontend origins
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000"   // Alternative React dev
        ));
        
        // Allow all HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Allow all headers (including Authorization)
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (needed for JWT)
        corsConfig.setAllowCredentials(true);
        
        // Expose Authorization header to frontend
        corsConfig.setExposedHeaders(Arrays.asList("Authorization"));
        
        return new CorsWebFilter(source);
    }
}
```

### CORS Flow

```plantuml
@startuml
!theme plain

participant "Browser" as B
participant "Gateway" as G
participant "Backend" as BE

B -> G: Preflight Request\nOPTIONS /parents-kids/users/me\nOrigin: http://localhost:5173

G -> G: Check CORS Configuration
alt Origin Allowed
  G --> B: 200 OK\nAccess-Control-Allow-Origin: http://localhost:5173\nAccess-Control-Allow-Methods: GET,POST,PUT,DELETE\nAccess-Control-Allow-Headers: *
  
  B -> G: Actual Request\nGET /parents-kids/users/me\nAuthorization: Bearer <JWT>
  
  G -> BE: Forward Request
  BE --> G: Response
  
  G --> B: Response with CORS Headers
  
else Origin Blocked
  G --> B: CORS Error
end

@enduml
```

---

## Components

### Core Components Overview

```plantuml
@startuml
!theme plain
package "API Gateway Components" {
  
  [CorsConfig] --> [CorsWebFilter] : creates
  
  [JwtUtil] --> [JWT Validation] : provides
  [JwtAuthenticationFilter] --> [JwtUtil] : uses
  [JwtAuthenticationFilter] --> [SecurityRulesLoader] : uses
  
  [SecurityRulesLoader] --> [YAML Files] : loads
  [SecurityRulesLoader] --> [Security Rules] : parses
  
  [RouteConfiguration] --> [RouteLocator] : creates
  [RouteLocator] --> [Backend Services] : routes to
  
  note right of [JwtAuthenticationFilter]
    GlobalFilter - applies to all requests
    Order: -1 (executes before routing)
  end note
  
  note bottom of [SecurityRulesLoader]
    Loads rules at startup
    Pattern matching with wildcards
    Method-specific rules
  end note
}

@enduml
```

### Component Responsibilities

| Component | Purpose | Key Methods |
|-----------|---------|-------------|
| **CorsConfig** | CORS policy setup | corsWebFilter() |
| **JwtUtil** | JWT validation & parsing | validateToken(), extractRole() |
| **JwtAuthenticationFilter** | Request authentication | filter(), onError() |
| **SecurityRulesLoader** | Load & match security rules | requiresAuthentication(), isAccessAllowed() |
| **RouteConfiguration** | Service routing setup | customRouteLocator() |

---

## Configuration

### Environment Variables

```bash
# Service URIs
ADMIN_SERVICE_URI=http://admin-service:9091
AUTH_SERVICE_URI=http://auth-service:9092
PARENTS_KIDS_SERVICE_URI=http://parents-kids-service:9093
TEACHERS_COURSES_SERVICE_URI=http://teachers-courses-service:9094

# JWT Configuration (must match auth-service)
JWT_SECRET=SB4cgMKW7XkP83H5z94FfHd8QXYZVaJ2GtRbnLm5uEvsUwC6DTjeKqNyA7pZkrx
JWT_EXPIRATION=86400000
```

### Application Configuration

```yaml
# application.yml
server:
  port: 9000

spring:
  application:
    name: api-gateway

# JWT settings
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}

# Logging
logging:
  level:
    com.nova_pioneers.api_gateway: DEBUG
    org.springframework.cloud.gateway: DEBUG
```

### Route Patterns

| Route Pattern | Target Service | Strip Prefix |
|---------------|----------------|--------------|
| `/admin/**` | admin-service:9091 | 1 |
| `/auth/**` | auth-service:9092 | 1 |
| `/parents-kids/**` | parents-kids-service:9093 | 1 |
| `/teachers-courses/**` | teachers-courses-service:9094 | 1 |

**Example:**
- Request: `GET /parents-kids/users/me`
- Routed to: `GET http://parents-kids-service:9093/users/me`

---

## Troubleshooting

### Common Issues

#### 1. **CORS Errors**
```
Access to fetch at 'http://localhost:9000/auth/signin' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:** Check CorsConfig allows your frontend origin.

#### 2. **JWT Validation Failures**
```
401 Unauthorized: Invalid JWT token
```

**Debugging:**
- Verify JWT_SECRET matches auth-service
- Check token expiration
- Validate token format: `Bearer <token>`

#### 3. **Security Rule Mismatches**
```
403 Forbidden: Access denied for role: parent
```

**Debugging:**
- Check security YAML files are loaded
- Verify rule patterns match request paths
- Confirm user role in JWT payload

#### 4. **Route Not Found**
```
404 Not Found
```

**Solution:**
- Verify route patterns in RouteConfiguration
- Check service URIs are correct
- Ensure services are running

### Debug Logging

Enable debug logging in application.yml:
```yaml
logging:
  level:
    com.nova_pioneers.api_gateway: DEBUG
    org.springframework.cloud.gateway: DEBUG
    org.springframework.web.cors: DEBUG
```

### Health Checks

```bash
# Test gateway is running
curl http://localhost:9000/actuator/health

# Test public endpoints
curl http://localhost:9000/auth/api/test

# Test protected endpoints (should fail without JWT)
curl http://localhost:9000/parents-kids/users/me

# Test with JWT
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:9000/parents-kids/users/me
```

---

## Security Best Practices

### 1. **JWT Secret Management**
- Use strong, random secrets (256+ bits)
- Never commit secrets to version control
- Rotate secrets periodically
- Use environment variables

### 2. **CORS Configuration**
- Whitelist specific origins, not wildcards
- Use HTTPS in production
- Limit exposed headers

### 3. **Security Rules**
- Follow principle of least privilege
- Use specific patterns over wildcards
- Regular security rule audits
- Test rule changes thoroughly

### 4. **Monitoring**
- Log authentication failures
- Monitor response times
- Track error rates by service
- Set up alerts for anomalies

---

This documentation provides a comprehensive overview of how the Nova Pioneers API Gateway works, from high-level architecture to detailed troubleshooting guides.
