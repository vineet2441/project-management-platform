package com.projectmanagement.dto;

public class ProjectCreateRequest {
    private String name;
    private String description;
    private String visibility;

    public ProjectCreateRequest() {

    }

    public ProjectCreateRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public ProjectCreateRequest(String name, String description, String visibility) {
        this.name = name;
        this.description = description;
        this.visibility = visibility;
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

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
}
