package com.example.taskapi.controller;

import com.example.taskapi.DTO.Dtos;
import com.example.taskapi.repository.UserRepository;
import com.example.taskapi.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only APIs")
public class AdminController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @GetMapping("/tasks")
    @Operation(summary = "Get ALL tasks (Admin only)")
    public ResponseEntity<Dtos.ApiResponse<List<Dtos.TaskResponse>>> getAllTasks() {
        return ResponseEntity.ok(Dtos.ApiResponse.success("All tasks retrieved", taskService.getAllTasks()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<Dtos.ApiResponse<List<Dtos.UserResponse>>> getAllUsers() {
        List<Dtos.UserResponse> users = userRepository.findAll()
                .stream()
                .map(Dtos.UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Dtos.ApiResponse.success("All users retrieved", users));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user (Admin only)")
    public ResponseEntity<Dtos.ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Dtos.ApiResponse.success("User deleted", null));
    }
}
