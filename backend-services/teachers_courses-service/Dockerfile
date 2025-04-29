# Build stage
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /build

# Copy only the POM file first to leverage Docker caching for dependencies
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src/

# Build the application (always runs when Docker image is rebuilt)
RUN mvn clean install -DskipTests

# Runtime stage - using a smaller base image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /build/target/teachers_courses-service*.jar backend.jar

# Expose the port Spring Boot will run on
EXPOSE 9094

# Run the application on port 9090
ENTRYPOINT ["java", "-jar", "backend.jar", "--server.port=9094"]

