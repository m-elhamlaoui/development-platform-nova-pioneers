FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/backend-*.jar backend.jar

# Expose the port Spring Boot will run on
EXPOSE 8080


ENTRYPOINT ["java", "-jar", "backend.jar"]
