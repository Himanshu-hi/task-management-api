package com.example.taskapi.service;



import com.example.taskapi.DTO.Dtos;
import com.example.taskapi.entity.Task;
import com.example.taskapi.entity.User;
import com.example.taskapi.exception.ResourceNotFoundException;
import com.example.taskapi.repository.TaskRepository;
import com.example.taskapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Page<Dtos.TaskResponse> getUserTasks(String email, Pageable pageable) {
        User user = getUserByEmail(email);
        return taskRepository.findByUserId(user.getId(), pageable)
                .map(Dtos.TaskResponse::from);
    }

    public Dtos.TaskResponse getTaskById(Long taskId, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return Dtos.TaskResponse.from(task);
    }

    @Transactional
    public Dtos.TaskResponse createTask(Dtos.TaskRequest request, String email) {
        User user = getUserByEmail(email);

        Task task = Task.builder()
                .title(sanitize(request.getTitle()))
                .description(sanitize(request.getDescription()))
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.PENDING)
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .user(user)
                .build();

        return Dtos.TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public Dtos.TaskResponse updateTask(Long taskId, Dtos.TaskRequest request, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setTitle(sanitize(request.getTitle()));
        task.setDescription(sanitize(request.getDescription()));
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());

        return Dtos.TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId, String email) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    public List<Dtos.TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(Dtos.TaskResponse::from)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}