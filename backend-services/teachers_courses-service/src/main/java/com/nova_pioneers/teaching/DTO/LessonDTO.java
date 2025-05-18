package com.nova_pioneers.teaching.DTO;

import lombok.Data;
import java.util.List;

@Data
public class LessonDTO {
    private Long id;
    private String title;
    private String image;
    private List<ContentSectionDTO> content;
    private Integer sequenceOrder;
}
