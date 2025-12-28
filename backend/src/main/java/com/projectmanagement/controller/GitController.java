package com.projectmanagement.controller;

import com.projectmanagement.dto.*;
import com.projectmanagement.service.CollaboratorService;
import com.projectmanagement.service.GitService;
import com.projectmanagement.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/git")
public class GitController {

    @Autowired
    private GitService gitService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private CollaboratorService collaboratorService;

    // Check read permission (for cloning)
    private void requireReadPermission(Long projectId, Authentication auth) {
        if (!collaboratorService.canReadGit(auth.getName(), projectId)) {
            throw new RuntimeException("Access denied: you don't have permission to access this repository");
        }
    }

    // Check write permission (for push, pull, branches)
    private void requireWritePermission(Long projectId, Authentication auth) {
        if (!collaboratorService.canWriteGit(auth.getName(), projectId)) {
            throw new RuntimeException("Access denied: only project owner or maintainers can write to this repository");
        }
    }

    @PostMapping("/clone")
    public ResponseEntity<String> cloneRepo(@PathVariable Long projectId,
            @RequestBody GitCloneRequest req,
            Authentication auth) throws Exception {
        requireReadPermission(projectId, auth);
        String path = gitService.cloneOrAttach(projectId, req.getRemoteUrl(), req.getBranch(),
                req.getAuth() != null ? req.getAuth().getUsername() : null,
                req.getAuth() != null ? req.getAuth().getPassword() : null,
                auth.getName());
        return ResponseEntity.ok(path);
    }

    @GetMapping("/branches")
    public ResponseEntity<List<String>> branches(@PathVariable Long projectId, Authentication auth) throws Exception {
        requireReadPermission(projectId, auth);
        return ResponseEntity.ok(gitService.listBranches(projectId, auth.getName()));
    }

    @PostMapping("/branches")
    public ResponseEntity<Void> createBranch(@PathVariable Long projectId,
            @RequestBody GitBranchCreateRequest req,
            Authentication auth) throws Exception {
        requireWritePermission(projectId, auth);
        gitService.createBranch(projectId, req.getBranch(), auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pull")
    public ResponseEntity<Void> pull(@PathVariable Long projectId,
            @RequestBody GitPullDTO req,
            Authentication auth) throws Exception {
        requireWritePermission(projectId, auth);
        gitService.pull(projectId, req.getBranch(),
                req.getAuth() != null ? req.getAuth().getUsername() : null,
                req.getAuth() != null ? req.getAuth().getPassword() : null,
                auth.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/push")
    public ResponseEntity<Void> push(@PathVariable Long projectId,
            @RequestBody GitPushDTO req,
            Authentication auth) throws Exception {
        requireWritePermission(projectId, auth);
        gitService.push(projectId, req.getBranch(),
                req.getAuth() != null ? req.getAuth().getUsername() : null,
                req.getAuth() != null ? req.getAuth().getPassword() : null,
                auth.getName());
        return ResponseEntity.ok().build();
    }
}
