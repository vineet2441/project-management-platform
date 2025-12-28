package com.projectmanagement.dto;

import com.projectmanagement.model.ProjectVisibility;

public class SetVisibilityRequest {
    private ProjectVisibility visibility;

    public ProjectVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(ProjectVisibility visibility) {
        this.visibility = visibility;
    }
}
