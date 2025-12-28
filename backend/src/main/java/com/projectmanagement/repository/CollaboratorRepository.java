package com.projectmanagement.repository;

import com.projectmanagement.model.Collaborator;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
    List<Collaborator> findByProject(Project project);

    Optional<Collaborator> findByProjectAndUser(Project project, User user);

    boolean existsByProjectAndUser(Project project, User user);
}
