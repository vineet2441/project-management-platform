package com.projectmanagement.dto;

public class CodeSaveRequest {
    private String code;

    public CodeSaveRequest() {
    }

    public CodeSaveRequest(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
