package com.vijay.user_service.controller;

import com.vijay.user_service.entity.User;
import com.vijay.user_service.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService service;

    public AuthController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password) {
        return service.login(email, password);
    }
}
