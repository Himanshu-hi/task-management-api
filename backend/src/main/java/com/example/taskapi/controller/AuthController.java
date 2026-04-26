package com.example.taskapi.controller;


import com.example.taskapi.DTO.Dtos;
import com.example.taskapi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login APIs")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<Dtos.ApiResponse<Dtos.AuthResponse>> register(
            @Valid @RequestBody Dtos.RegisterRequest request) {
        Dtos.AuthResponse response = authService.register(request);
        return ResponseEntity.ok(Dtos.ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and get JWT token")
    public ResponseEntity<Dtos.ApiResponse<Dtos.AuthResponse>> login(
            @Valid @RequestBody Dtos.LoginRequest request) {
        Dtos.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(Dtos.ApiResponse.success("Login successful", response));
    }
}