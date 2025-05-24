package com.nova_pioneers.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SigninResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String token;
}
