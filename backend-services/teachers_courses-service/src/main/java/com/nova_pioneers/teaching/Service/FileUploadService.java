package com.nova_pioneers.teaching.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileUploadService {

    // Update this to match your application.yml property
    @Value("${file.upload.dir:./uploads/}")
    private String uploadBaseDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};

    public String saveCourseImage(MultipartFile file, String prefix) throws IOException {
        System.out.println("=== Starting saveCourseImage ===");
        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("Prefix: " + prefix);
        System.out.println("Upload base dir: " + uploadBaseDir);
        
        validateFile(file);
        return saveFile(file, "courses/", prefix);
    }

    public String saveLessonImage(MultipartFile file, String prefix) throws IOException {
        System.out.println("=== Starting saveLessonImage ===");
        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("Prefix: " + prefix);
        
        validateFile(file);
        return saveFile(file, "lessons/", prefix);
    }

    public String saveContentImage(MultipartFile file, String prefix) throws IOException {
        System.out.println("=== Starting saveContentImage ===");
        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("Prefix: " + prefix);
        
        validateFile(file);
        return saveFile(file, "content/", prefix);
    }

    private String saveFile(MultipartFile file, String directory, String prefix) throws IOException {
        System.out.println("=== saveFile method called ===");
        System.out.println("Upload base dir: " + uploadBaseDir);
        System.out.println("Directory: " + directory);
        System.out.println("Prefix: " + prefix);
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadBaseDir, directory);
        System.out.println("Full upload path: " + uploadPath.toAbsolutePath());
        
        try {
            Files.createDirectories(uploadPath);
            System.out.println("Directory created successfully: " + uploadPath);
        } catch (IOException e) {
            System.err.println("Failed to create directory: " + e.getMessage());
            throw e;
        }

        // Verify directory exists and is writable
        if (!Files.exists(uploadPath)) {
            throw new IOException("Failed to create upload directory: " + uploadPath);
        }

        if (!Files.isWritable(uploadPath)) {
            throw new IOException("Upload directory is not writable: " + uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String filename = String.format("%s_%s_%s%s", prefix, timestamp, uniqueId, extension);

        // Save file
        Path filePath = uploadPath.resolve(filename);
        System.out.println("Saving file to: " + filePath.toAbsolutePath());

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File copied successfully");
        } catch (IOException e) {
            System.err.println("Failed to save file: " + e.getMessage());
            throw e;
        }

        // Verify file was saved
        if (!Files.exists(filePath)) {
            throw new IOException("File was not saved successfully: " + filePath);
        }

        long savedFileSize = Files.size(filePath);
        System.out.println("File saved successfully: " + filePath + " (size: " + savedFileSize + " bytes)");

        // Return relative path for database storage
        String relativePath = directory + filename;
        System.out.println("Returning relative path: " + relativePath);
        return relativePath;
    }

    private void validateFile(MultipartFile file) throws IllegalArgumentException {
        System.out.println("=== Validating file ===");
        
        if (file == null) {
            throw new IllegalArgumentException("File is null");
        }
        
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        System.out.println("File size: " + file.getSize() + " bytes");
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        String originalFilename = file.getOriginalFilename();
        System.out.println("Original filename: " + originalFilename);
        
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        System.out.println("File extension: " + extension);
        
        boolean validExtension = false;
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (extension.equals(allowedExt)) {
                validExtension = true;
                break;
            }
        }

        if (!validExtension) {
            throw new IllegalArgumentException(
                    "File type not allowed. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
        
        System.out.println("File validation passed");
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}
