package com.projectmanagement.dto;

import com.projectmanagement.model.CollaboratorRole;

public class AddCollaboratorRequest {
    private String username;
    private CollaboratorRole role;

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
}
