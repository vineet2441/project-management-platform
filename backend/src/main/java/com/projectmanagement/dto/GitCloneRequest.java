package com.projectmanagement.dto;

public class GitCloneRequest {
    private String remoteUrl;
    private String branch;
    private GitAuth auth;

    public String getRemoteUrl() {
        return remoteUrl;
    }

    public void setRemoteUrl(String remoteUrl) {
        this.remoteUrl = remoteUrl;
    }

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
