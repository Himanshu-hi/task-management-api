package com.example.taskapi.repository;

//import com.taskapi.entity.Task;
import com.example.taskapi.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUserId(Long userId, Pageable pageable);
    Optional<Task> findByIdAndUserId(Long id, Long userId);
    List<Task> findByUserId(Long userId);
}
