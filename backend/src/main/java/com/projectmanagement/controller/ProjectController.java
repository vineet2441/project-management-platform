package com.projectmanagement.controller;

import com.projectmanagement.dto.ProjectCreateRequest;
import com.projectmanagement.dto.ProjectUpdateRequest;
import com.projectmanagement.dto.SetVisibilityRequest;
import com.projectmanagement.dto.ProjectResponse;
import com.projectmanagement.dto.CodeSaveRequest;
import com.projectmanagement.dto.CodeResponse;
import com.projectmanagement.model.Project;
import com.projectmanagement.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // create new project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectCreateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Project project = projectService.createProject(request.getName(), request.getDescription(),
                    request.getVisibility(), username);
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // get all projects of user
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getUserProjects(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<Project> projects = projectService.getUserProjects(username);
            List<ProjectResponse> response = projects.stream().map(ProjectResponse::new).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // get single project
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication != null && authentication.isAuthenticated()
                    ? authentication.getName()
                    : "anonymous";
            Project project = projectService.getProject(id, username);
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // update project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
            @RequestBody ProjectUpdateRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Project project = projectService.updateProject(id, request.getName(), request.getDescription(), username);
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            projectService.deleteProject(id, username);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // set visibility
    @PostMapping("/{id}/visibility")
    public ResponseEntity<ProjectResponse> setVisibility(@PathVariable Long id,
            @RequestBody SetVisibilityRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Project project = projectService.setVisibility(id, username, request.getVisibility());
            return ResponseEntity.ok(new ProjectResponse(project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // fork a public project
    @PostMapping("/{id}/fork")
    public ResponseEntity<ProjectResponse> forkProject(@PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Project forked = projectService.forkProject(id, username);
            return ResponseEntity.ok(new ProjectResponse(forked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // save code
    @PostMapping("/{id}/code")
    public ResponseEntity<Void> saveCode(@PathVariable Long id,
            @RequestBody CodeSaveRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            projectService.saveCode(id, username, request.getCode());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // get code
    @GetMapping("/{id}/code")
    public ResponseEntity<CodeResponse> getCode(@PathVariable Long id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            String code = projectService.getCode(id, username);
            return ResponseEntity.ok(new CodeResponse(code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
