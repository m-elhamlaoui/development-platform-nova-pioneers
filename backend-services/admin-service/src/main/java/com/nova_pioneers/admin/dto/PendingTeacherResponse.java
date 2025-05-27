package com.nova_pioneers.admin.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PendingTeacherResponse {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
}