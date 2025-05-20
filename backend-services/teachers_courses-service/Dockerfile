# Build stage with optimized caching
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /build

# Copy only POM file first for better dependency caching
COPY pom.xml .

# Download dependencies with explicit cache location and offline mode
# This creates a separate cache layer that won't change unless pom.xml changes
RUN mvn -Dmaven.repo.local=/build/.m2/repository dependency:go-offline

# Copy source code (changes more frequently)
COPY src ./src/

# Build with improved settings
# 1. Skip tests during build (they'll run separately)
# 2. Build only what's needed for the JAR
# 3. Use the cached local repo
RUN mvn -Dmaven.repo.local=/build/.m2/repository clean package -DskipTests

# Runtime stage - optimized small image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /build/target/teachers_courses-service*.jar app.jar

# Single EXPOSE statement - no redundant port specification
EXPOSE 9094

# Configure Spring DevTools in the entrypoint
# Remove redundant server.port setting (use application.yml instead)
# Add remote debugging support for development
ENTRYPOINT ["java", \
            "-Dspring.devtools.restart.enabled=true", \
            "-Dspring.devtools.livereload.enabled=true", \
            "-jar", "app.jar"]