package com.projectmanagement.controller;

import com.projectmanagement.dto.ProjectResponse;
import com.projectmanagement.model.Project;
import com.projectmanagement.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/projects")
public class PublicProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> list() {
        List<Project> projects = projectService.listPublicProjects();
        return ResponseEntity.ok(projects.stream().map(ProjectResponse::new).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getOne(@PathVariable Long id) {
        Project project = projectService.getPublicProject(id);
        return ResponseEntity.ok(new ProjectResponse(project));
    }
}
