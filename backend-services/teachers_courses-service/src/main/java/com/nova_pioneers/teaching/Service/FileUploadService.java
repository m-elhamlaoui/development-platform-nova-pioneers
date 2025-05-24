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

    @Value("${file.upload.dir:src/main/resources/uploads}")
    private String uploadBaseDir;

    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public String saveCourseImage(MultipartFile file, String type) throws IOException {
        validateFile(file);

        String directory = "courses/";
        String prefix = "course-";

        return saveFile(file, directory, prefix);
    }

    public String saveLessonImage(MultipartFile file, String type) throws IOException {
        validateFile(file);

        String directory = "lessons/";
        String prefix = "lesson-";

        return saveFile(file, directory, prefix);
    }

    public String saveContentImage(MultipartFile file, String type) throws IOException {
        validateFile(file);

        String directory = "content/";
        String prefix = "content-";

        return saveFile(file, directory, prefix);
    }

    private String saveFile(MultipartFile file, String directory, String prefix) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadBaseDir, directory);
        Files.createDirectories(uploadPath);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        String filename = String.format("%s%s_%s%s", prefix, timestamp, uniqueId, extension);

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path for database storage
        return directory + filename;
    }

    private void validateFile(MultipartFile file) throws IllegalArgumentException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = getFileExtension(originalFilename).toLowerCase();
        boolean validExtension = false;
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (extension.equals(allowedExt)) {
                validExtension = true;
                break;
            }
        }

        if (!validExtension) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}
