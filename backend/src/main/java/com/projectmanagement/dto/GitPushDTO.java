package com.projectmanagement.dto;

public class GitPushDTO {
    private String branch;
    private String message; // optional commit message if we add files later
    private GitAuth auth;

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public GitAuth getAuth() {
        return auth;
    }

    public void setAuth(GitAuth auth) {
        this.auth = auth;
    }
}
