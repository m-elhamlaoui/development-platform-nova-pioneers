package com.nova_pioneers.admin.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String role;
    private Boolean isActive = true;
}