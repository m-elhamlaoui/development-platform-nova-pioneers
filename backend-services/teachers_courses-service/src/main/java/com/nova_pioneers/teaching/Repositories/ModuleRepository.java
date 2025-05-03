package com.nova_pioneers.teaching.Repositories;

import com.nova_pioneers.teaching.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByCourseId(Long courseId);
    List<Module> findByCourseIdOrderBySequenceOrder(Long courseId);
}
