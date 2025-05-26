package com.nova_pioneers.teaching;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir:src/main/resources/uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        // Create upload directories on startup
        createDirectoryIfNotExists(uploadDir);
        createDirectoryIfNotExists(uploadDir + "/courses");
        createDirectoryIfNotExists(uploadDir + "/lessons");
        createDirectoryIfNotExists(uploadDir + "/content");

        System.out.println("Upload directory configured at: " + Paths.get(uploadDir).toAbsolutePath());
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files - THIS IS CRUCIAL
        String uploadPath = Paths.get(uploadDir).toAbsolutePath().toString();

        registry.addResourceHandler("/api/files/**")
                .addResourceLocations("file:" + uploadPath + "/")
                .setCachePeriod(3600); // Cache for 1 hour

        System.out.println("Configured file serving: /api/files/** -> " + uploadPath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS for file uploads and API calls
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Add your frontend URLs
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    private void createDirectoryIfNotExists(String directory) {
        try {
            Path path = Paths.get(directory);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println("Created directory: " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Failed to create directory: " + directory);
            e.printStackTrace();
        }
    }
}
