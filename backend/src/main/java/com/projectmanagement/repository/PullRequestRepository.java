package com.projectmanagement.repository;

import com.projectmanagement.model.PullRequest;
import com.projectmanagement.model.Project;
import com.projectmanagement.model.PullRequestStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PullRequestRepository extends JpaRepository<PullRequest, Long> {
    List<PullRequest> findByProject(Project project);

    List<PullRequest> findByProjectAndStatus(Project project, PullRequestStatus status);

    Optional<PullRequest> findByIdAndProject(Long id, Project project);
}
