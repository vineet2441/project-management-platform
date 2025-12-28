package com.projectmanagement.service;

import com.projectmanagement.model.*;
import com.projectmanagement.repository.CollaboratorRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.PullRequestRepository;
import com.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PullRequestService {
    @Autowired
    private PullRequestRepository pullRequestRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CollaboratorRepository collaboratorRepository;

    private Project loadProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    private boolean canOpenPR(Project project, User user) {
        if (project.getVisibility() == ProjectVisibility.PUBLIC)
            return true;
        if (project.getOwner().getId().equals(user.getId()))
            return true;
        return collaboratorRepository.findByProjectAndUser(project, user).isPresent();
    }

    private boolean canMergePR(Project project, User user) {
        if (project.getOwner().getId().equals(user.getId()))
            return true;
        return collaboratorRepository.findByProjectAndUser(project, user)
                .map(c -> c.getRole() == CollaboratorRole.MAINTAINER)
                .orElse(false);
    }

    public PullRequest create(String username, Long projectId, String title, String description, String sourceBranch,
            String targetBranch, Long sourceProjectId) {
        User u = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project p = loadProject(projectId);
        if (!canOpenPR(p, u))
            throw new RuntimeException("Not allowed to open PR");
        Project source = null;
        if (sourceProjectId != null) {
            source = projectRepository.findById(sourceProjectId)
                    .orElseThrow(() -> new RuntimeException("Source project not found"));
            if (!source.getOwner().getId().equals(u.getId())) {
                throw new RuntimeException("You must own the source project");
            }
            if (source.getForkedFrom() == null || !source.getForkedFrom().getId().equals(p.getId())) {
                throw new RuntimeException("Source project is not a fork of target project");
            }
        }
        PullRequest pr = new PullRequest();
        pr.setProject(p);
        pr.setSourceProject(source);
        pr.setCreatedBy(u);
        pr.setTitle(title);
        pr.setDescription(description);
        pr.setSourceBranch(sourceBranch);
        pr.setTargetBranch(targetBranch);
        return pullRequestRepository.save(pr);
    }

    public List<PullRequest> list(Long projectId) {
        Project p = loadProject(projectId);
        return pullRequestRepository.findByProject(p);
    }

    public PullRequest merge(String username, Long projectId, Long prId) {
        User u = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project p = loadProject(projectId);
        PullRequest pr = pullRequestRepository.findByIdAndProject(prId, p)
                .orElseThrow(() -> new RuntimeException("PR not found"));
        if (!canMergePR(p, u))
            throw new RuntimeException("Not allowed to merge");
        if (pr.getStatus() != PullRequestStatus.OPEN)
            throw new RuntimeException("PR not open");
        // Merge code from sourceProject into target project (simple: overwrite code)
        Project source = pr.getSourceProject();
        if (source == null) {
            throw new RuntimeException("PR missing source project");
        }
        p.setCode(source.getCode());
        projectRepository.save(p);
        pr.setStatus(PullRequestStatus.MERGED);
        return pullRequestRepository.save(pr);
    }

    public PullRequest close(String username, Long projectId, Long prId) {
        User u = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project p = loadProject(projectId);
        PullRequest pr = pullRequestRepository.findByIdAndProject(prId, p)
                .orElseThrow(() -> new RuntimeException("PR not found"));
        if (!canMergePR(p, u) && !pr.getCreatedBy().getId().equals(u.getId()))
            throw new RuntimeException("Not allowed to close");
        if (pr.getStatus() != PullRequestStatus.OPEN)
            throw new RuntimeException("PR not open");
        pr.setStatus(PullRequestStatus.CLOSED);
        return pullRequestRepository.save(pr);
    }
}
