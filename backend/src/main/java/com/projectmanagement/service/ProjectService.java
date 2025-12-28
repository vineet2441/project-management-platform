package com.projectmanagement.service;

import com.projectmanagement.model.*;
import com.projectmanagement.repository.CollaboratorRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollaboratorRepository collaboratorRepository;

    // create new project
    public Project createProject(String name, String description, String visibility, String username) {
        User owner = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project project = new Project(name, description, owner);
        ProjectVisibility vis = ProjectVisibility.PRIVATE;
        if (visibility != null && !visibility.isBlank()) {
            try {
                vis = ProjectVisibility.valueOf(visibility.toUpperCase());
            } catch (IllegalArgumentException ignored) {
                vis = ProjectVisibility.PRIVATE;
            }
        }
        project.setVisibility(vis);
        return projectRepository.save(project);
    }

    // all projects of specific user
    public List<Project> getUserProjects(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        return projectRepository.findByOwnerId(user.getId());
    }

    // get single project
    public Project getProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Public projects: anyone (including anonymous) can access
        if (project.getVisibility() == ProjectVisibility.PUBLIC) {
            return project;
        }

        // For private projects, need to be a user
        if ("anonymous".equals(username)) {
            throw new RuntimeException("Project not found or access denied");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Owner can always access
        if (project.getOwner().getId().equals(user.getId())) {
            return project;
        }

        // Private projects: check if user is a collaborator
        if (collaboratorRepository.findByProjectAndUser(project, user).isPresent()) {
            return project;
        }

        throw new RuntimeException("Project not found or access denied");
    }

    // update project
    public Project updateProject(Long projectId, String name, String description, String username) {
        Project project = getProject(projectId, username); // ownership check
        project.setName(name);
        project.setDescription(description);
        return projectRepository.save(project);
    }

    // delete
    public void deleteProject(Long projectId, String username) {
        Project project = getProject(projectId, username);
        projectRepository.delete(project);
    }

    // public discovery
    public List<Project> listPublicProjects() {
        // simple scan via repository method; implement query in repository
        return projectRepository.findByVisibility(ProjectVisibility.PUBLIC);
    }

    // get all public projects
    public List<Project> getPublicProjects() {
        return projectRepository.findByVisibility(ProjectVisibility.PUBLIC);
    }

    // public project detail
    public Project getPublicProject(Long projectId) {
        return projectRepository.findByIdAndVisibility(projectId, ProjectVisibility.PUBLIC)
                .orElseThrow(() -> new RuntimeException("Project not found or not public"));
    }

    // owner can change visibility
    public Project setVisibility(Long projectId, String username, ProjectVisibility visibility) {
        Project project = getProject(projectId, username);
        project.setVisibility(visibility);
        return projectRepository.save(project);
    }

    // fork a public project to current user's workspace
    public Project forkProject(Long sourceProjectId, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project source = projectRepository.findById(sourceProjectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Only public projects or owned projects can be forked
        if (source.getVisibility() != ProjectVisibility.PUBLIC && !source.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Cannot fork: project is not public and you don't own it");
        }

        // Create new project owned by current user with same code
        Project fork = new Project();
        fork.setName(source.getName() + " (fork)");
        fork.setDescription(source.getDescription());
        fork.setCode(source.getCode()); // COPY the code to forked project
        fork.setOwner(user);
        fork.setForkedFrom(source);
        fork.setVisibility(ProjectVisibility.PRIVATE); // Forked projects are private by default

        return projectRepository.save(fork);
    }

    // save code for a project (only owner and collaborators with write access)
    public Project saveCode(Long projectId, String username, String code) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Only owner can save code for private projects
        if (!project.getOwner().getId().equals(user.getId())) {
            // Check if user is a CONTRIBUTOR or MAINTAINER (not VIEWER)
            var collab = collaboratorRepository.findByProjectAndUser(project, user);
            if (collab.isEmpty() || collab.get().getRole() == CollaboratorRole.VIEWER) {
                throw new RuntimeException("Access denied: you do not have write permission");
            }
        }

        project.setCode(code);
        return projectRepository.save(project);
    }

    // get code for a project
    public String getCode(Long projectId, String username) {
        Project project = getProject(projectId, username);
        return project.getCode() != null ? project.getCode() : "";
    }
}
