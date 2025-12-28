package com.projectmanagement.repository;

import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectVisibility;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId); // all project of a specific user

    Optional<Project> findByIdAndOwnerId(Long id, Long ownerId);
    // load that project only if it belongs to the user

    boolean existsByNameAndOwnerId(String name, Long ownerId);
    // check if agar wo project name already exist krta h us user k liye

    List<Project> findByVisibility(ProjectVisibility visibility);

    Optional<Project> findByIdAndVisibility(Long id, ProjectVisibility visibility);

}
