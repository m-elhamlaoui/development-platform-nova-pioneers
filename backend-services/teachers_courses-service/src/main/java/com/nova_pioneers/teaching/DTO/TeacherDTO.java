package com.nova_pioneers.teaching.DTO;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TeacherDTO {
    private Long id;
    private String username;
    private String email;
    @JsonProperty("first_name")
    private String firstName;
    @JsonProperty("last_name")
    private String lastName;
    @JsonProperty("user_id")
    private Integer userId;
    @JsonProperty("certification_info")
    private String certificationInfo;
    @JsonProperty("join_date")
    private LocalDate joinDate;
    @JsonProperty("accumulated_xp")
    private Integer accumulatedXp;
    private String title;
}
