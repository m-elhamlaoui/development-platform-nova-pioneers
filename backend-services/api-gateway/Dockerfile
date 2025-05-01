FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml separately to leverage Docker cache
COPY pom.xml .

# Pre-fetch dependencies
RUN mvn dependency:go-offline

# Copy the rest of the source
COPY src ./src/

# Now build
RUN mvn clean install -DskipTests

# Runtime image
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app
COPY --from=builder /app/target/api-gateway*.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=9000"]
