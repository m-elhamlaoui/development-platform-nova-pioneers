package com.nova_pioneers.admin.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TeacherResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Integer userId;
    private String certificationInfo;
    private LocalDate joinDate;
    private Integer accumulatedXp;
    private String title;
}