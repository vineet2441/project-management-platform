package com.projectmanagement.controller;

import com.projectmanagement.dto.AddCollaboratorRequest;
import com.projectmanagement.dto.CollaboratorResponse;
import com.projectmanagement.model.Collaborator;
import com.projectmanagement.service.CollaboratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/collaborators")
public class CollaboratorController {

    @Autowired
    private CollaboratorService collaboratorService;

    @PostMapping
    public ResponseEntity<CollaboratorResponse> add(@PathVariable Long projectId,
            @RequestBody AddCollaboratorRequest req,
            Authentication auth) {
        Collaborator c = collaboratorService.addCollaborator(auth.getName(), projectId, req.getUsername(),
                req.getRole());
        return ResponseEntity.ok(new CollaboratorResponse(c));
    }

    @DeleteMapping("/{collaboratorId}")
    public ResponseEntity<?> remove(@PathVariable Long projectId,
            @PathVariable Long collaboratorId,
            Authentication auth) {
        collaboratorService.removeCollaborator(auth.getName(), projectId, collaboratorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CollaboratorResponse>> list(@PathVariable Long projectId, Authentication auth) {
        List<Collaborator> list = collaboratorService.listCollaborators(auth.getName(), projectId);
        return ResponseEntity.ok(list.stream().map(CollaboratorResponse::new).toList());
    }
}
