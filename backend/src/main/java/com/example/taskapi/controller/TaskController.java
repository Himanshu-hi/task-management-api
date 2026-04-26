package com.example.taskapi.controller;

import com.example.taskapi.DTO.Dtos;
import com.example.taskapi.DTO.Dtos.*;
import com.example.taskapi.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "Task CRUD APIs")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Get all tasks for logged-in user (paginated)")
    public ResponseEntity<Dtos.ApiResponse<Page<Dtos.TaskResponse>>> getTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Dtos.TaskResponse> tasks = taskService.getUserTasks(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(Dtos.ApiResponse.success("Tasks retrieved", tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific task by ID")
    public ResponseEntity<Dtos.ApiResponse<Dtos.TaskResponse>> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Dtos.TaskResponse task = taskService.getTaskById(id, userDetails.getUsername());
        return ResponseEntity.ok(Dtos.ApiResponse.success("Task retrieved", task));
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<Dtos.ApiResponse<Dtos.TaskResponse>> createTask(
            @Valid @RequestBody Dtos.TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Dtos.TaskResponse task = taskService.createTask(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Dtos.ApiResponse.success("Task created", task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<Dtos.ApiResponse<Dtos.TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Dtos.TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Dtos.TaskResponse task = taskService.updateTask(id, request, userDetails.getUsername());
        return ResponseEntity.ok(Dtos.ApiResponse.success("Task updated", task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Dtos.ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
        return ResponseEntity.ok(Dtos.ApiResponse.success("Task deleted", null));
    }
}
