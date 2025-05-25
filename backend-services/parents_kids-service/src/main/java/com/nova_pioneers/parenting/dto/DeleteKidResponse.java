package com.nova_pioneers.parenting.dto;

public class DeleteKidResponse {
    private String message;

    // Constructors
    public DeleteKidResponse() {
    }

    public DeleteKidResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}