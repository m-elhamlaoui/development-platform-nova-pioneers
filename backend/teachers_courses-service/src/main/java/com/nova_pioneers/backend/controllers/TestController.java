package com.nova_pioneers.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/Teaching/test")
    public String testEndpoint() {
        return "Teaching Service Working";
    }
}
