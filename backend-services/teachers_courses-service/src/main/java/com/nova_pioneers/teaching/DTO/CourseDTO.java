package com.nova_pioneers.teaching.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String thumbnail;
    private String instructor;
    private String size;
    private Double rating;
    private Integer reviews;
    private List<LessonDTO> lessons;
}
