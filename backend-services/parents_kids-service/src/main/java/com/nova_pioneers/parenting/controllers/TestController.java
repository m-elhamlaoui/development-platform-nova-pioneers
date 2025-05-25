package com.nova_pioneers.parenting.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String testEndpoint() {
        return "Parenting service working";
    }

    @GetMapping("/parents-kids/test")
    public String testParentsKidsEndpoint() {
        return "Parents & Kids service working - Base URL configured correctly";
    }
}
