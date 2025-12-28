package com.projectmanagement.dto;

import com.projectmanagement.model.Project;
import com.projectmanagement.model.ProjectVisibility;
import java.time.LocalDateTime;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerUsername;
    private ProjectVisibility visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long forkedFromId;

    public ProjectResponse() {
    }

    public ProjectResponse(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.ownerId = project.getOwner().getId();
        this.ownerUsername = project.getOwner().getUsername();
        this.visibility = project.getVisibility() != null ? project.getVisibility() : ProjectVisibility.PRIVATE;
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
        this.forkedFromId = project.getForkedFrom() != null ? project.getForkedFrom().getId() : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public ProjectVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(ProjectVisibility visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getForkedFromId() {
        return forkedFromId;
    }

    public void setForkedFromId(Long forkedFromId) {
        this.forkedFromId = forkedFromId;
    }
}
