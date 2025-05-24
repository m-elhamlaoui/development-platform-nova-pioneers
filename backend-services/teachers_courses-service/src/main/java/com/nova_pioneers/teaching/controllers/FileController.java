package com.nova_pioneers.teaching.controllers;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.file.DirectoryStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${file.upload.dir:uploads}")
    private String uploadBaseDir;

    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(@RequestParam String filename) {
        try {
            Path filePath = Paths.get(uploadBaseDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.IMAGE_JPEG) // You might want to determine this dynamically
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/check-upload-dir")
    public ResponseEntity<Map<String, Object>> checkUploadDirectory() {
        Map<String, Object> response = new HashMap<>();

        try {
            Path uploadPath = Paths.get(uploadBaseDir);
            response.put("uploadDir", uploadBaseDir);
            response.put("absolutePath", uploadPath.toAbsolutePath().toString());
            response.put("exists", Files.exists(uploadPath));
            response.put("isDirectory", Files.isDirectory(uploadPath));
            response.put("isWritable", Files.isWritable(uploadPath));

            if (Files.exists(uploadPath)) {
                List<Map<String, Object>> contents = new ArrayList<>();
                try (DirectoryStream<Path> stream = Files.newDirectoryStream(uploadPath)) {
                    for (Path entry : stream) {
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("name", entry.getFileName().toString());
                        fileInfo.put("isDirectory", Files.isDirectory(entry));
                        fileInfo.put("size", Files.isDirectory(entry) ? "dir" : Files.size(entry));
                        contents.add(fileInfo);
                    }
                }
                response.put("contents", contents);

                // Check subdirectories
                List<String> subDirs = Arrays.asList("courses", "lessons", "content");
                Map<String, Object> subDirInfo = new HashMap<>();

                for (String dir : subDirs) {
                    Path subDir = uploadPath.resolve(dir);
                    Map<String, Object> info = new HashMap<>();
                    info.put("exists", Files.exists(subDir));
                    info.put("isWritable", Files.exists(subDir) && Files.isWritable(subDir));

                    if (Files.exists(subDir)) {
                        List<String> files = new ArrayList<>();
                        try (DirectoryStream<Path> stream = Files.newDirectoryStream(subDir)) {
                            for (Path entry : stream) {
                                files.add(entry.getFileName().toString());
                            }
                        }
                        info.put("files", files);
                    }

                    subDirInfo.put(dir, info);
                }

                response.put("subdirectories", subDirInfo);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            response.put("stackTrace", sw.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}