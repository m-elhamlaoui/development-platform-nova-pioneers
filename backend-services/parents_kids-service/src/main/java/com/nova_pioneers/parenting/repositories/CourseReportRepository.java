package com.nova_pioneers.parenting.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nova_pioneers.parenting.model.CourseReport;

import java.util.List;



@Repository

public interface CourseReportRepository extends JpaRepository<CourseReport, Long> {
    List<CourseReport> findByEnrollmentKidKidId(Long kidId);
}
