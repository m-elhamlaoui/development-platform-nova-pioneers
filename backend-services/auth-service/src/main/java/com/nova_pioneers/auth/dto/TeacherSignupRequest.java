package com.nova_pioneers.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherSignupRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
