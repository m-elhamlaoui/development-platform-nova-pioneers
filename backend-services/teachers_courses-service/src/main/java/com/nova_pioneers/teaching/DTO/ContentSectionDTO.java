package com.nova_pioneers.teaching.DTO;

import lombok.Data;

@Data
public class ContentSectionDTO {
    private Long id;
    private String subheading;
    private String text;
    private String image;
    private String funFact;
    private Integer sequenceOrder;
}