package com.nova_pioneers.teaching.DTO;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;





@Data
public class LessonDTO {
    private Long id;
    private String title;
    private String image;
    private Integer sequenceOrder;
    private List<ContentSectionDTO> content = new ArrayList<>();
}
