package com.projectmanagement.controller;

import com.projectmanagement.dto.PullRequestCreateRequest;
import com.projectmanagement.dto.PullRequestResponse;
import com.projectmanagement.model.PullRequest;
import com.projectmanagement.service.PullRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects/{projectId}/pull-requests")
public class PullRequestController {

    @Autowired
    private PullRequestService pullRequestService;

    private PullRequestResponse map(PullRequest pr) {
        PullRequestResponse dto = new PullRequestResponse();
        dto.setId(pr.getId());
        dto.setProjectId(pr.getProject().getId());
        dto.setSourceProjectId(pr.getSourceProject() != null ? pr.getSourceProject().getId() : null);
        dto.setTitle(pr.getTitle());
        dto.setDescription(pr.getDescription());
        dto.setSourceBranch(pr.getSourceBranch());
        dto.setTargetBranch(pr.getTargetBranch());
        dto.setCreatedBy(pr.getCreatedBy().getId());
        dto.setCreatedByUsername(pr.getCreatedBy().getUsername());
        dto.setStatus(pr.getStatus());
        dto.setCreatedAt(pr.getCreatedAt());
        dto.setUpdatedAt(pr.getUpdatedAt());
        return dto;
    }

    @PostMapping
    public ResponseEntity<PullRequestResponse> create(@PathVariable Long projectId,
            @RequestBody PullRequestCreateRequest req,
            Authentication auth) {
        PullRequest pr = pullRequestService.create(auth.getName(), projectId, req.getTitle(), req.getDescription(),
                req.getSourceBranch(), req.getTargetBranch(), req.getSourceProjectId());
        return ResponseEntity.ok(map(pr));
    }

    @GetMapping
    public ResponseEntity<List<PullRequestResponse>> list(@PathVariable Long projectId) {
        List<PullRequestResponse> list = pullRequestService.list(projectId).stream().map(this::map)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{prId}/merge")
    public ResponseEntity<PullRequestResponse> merge(@PathVariable Long projectId,
            @PathVariable Long prId,
            Authentication auth) {
        PullRequest pr = pullRequestService.merge(auth.getName(), projectId, prId);
        return ResponseEntity.ok(map(pr));
    }

    @PostMapping("/{prId}/close")
    public ResponseEntity<PullRequestResponse> close(@PathVariable Long projectId,
            @PathVariable Long prId,
            Authentication auth) {
        PullRequest pr = pullRequestService.close(auth.getName(), projectId, prId);
        return ResponseEntity.ok(map(pr));
    }
}
