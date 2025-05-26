package com.nova_pioneers.teaching.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Value("${file.upload.dir:/app/uploads/}")
    private String uploadBaseDir;

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfiguration() {
        Map<String, Object> config = new HashMap<>();

        // Basic info
        config.put("uploadBaseDir", uploadBaseDir);

        try {
            // File system info
            Path path = Paths.get(uploadBaseDir);
            File file = path.toFile();

            config.put("absolutePath", path.toAbsolutePath().toString());
            config.put("exists", Files.exists(path));
            config.put("isDirectory", Files.isDirectory(path));
            config.put("canRead", file.canRead());
            config.put("canWrite", file.canWrite());
            config.put("totalSpace", file.getTotalSpace());
            config.put("freeSpace", file.getFreeSpace());

            // Current working directory
            config.put("workingDirectory", System.getProperty("user.dir"));

            // Environment variables
            Map<String, String> env = new HashMap<>(System.getenv());
            config.put("environmentVariables", env);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("type", e.getClass().getName());
            config.put("error", error);
        }

        return ResponseEntity.ok(config);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}