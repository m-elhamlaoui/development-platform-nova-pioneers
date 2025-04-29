package com.nova_pioneers.admin.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/admin/test")
    public String testEndpoint() {
        return "Admin Service Working";
    }
}
