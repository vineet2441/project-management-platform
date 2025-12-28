package com.projectmanagement.dto;

public class GitPullDTO {
    private String branch;
    private GitAuth auth;

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public GitAuth getAuth() {
        return auth;
    }

    public void setAuth(GitAuth auth) {
        this.auth = auth;
    }
}
