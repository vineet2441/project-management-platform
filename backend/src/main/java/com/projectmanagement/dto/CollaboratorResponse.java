package com.projectmanagement.dto;

import com.projectmanagement.model.Collaborator;
import com.projectmanagement.model.CollaboratorRole;
import java.time.LocalDateTime;

public class CollaboratorResponse {
    private Long id;
    private Long userId;
    private String username;
    private CollaboratorRole role;
    private LocalDateTime createdAt;

    public CollaboratorResponse() {
    }

    public CollaboratorResponse(Collaborator c) {
        this.id = c.getId();
        this.userId = c.getUser().getId();
        this.username = c.getUser().getUsername();
        this.role = c.getRole();
        this.createdAt = c.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public CollaboratorRole getRole() {
        return role;
    }

    public void setRole(CollaboratorRole role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
