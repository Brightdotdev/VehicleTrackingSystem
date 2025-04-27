package com.example.UserTaskApplication.Exceptions;

public class InvalidTaskRequestException extends RuntimeException {

    private String errorCode;
    public InvalidTaskRequestException(String message, String errorCode) {
        super(message);
    }

    public String getErrorCode() {
        return errorCode;
    }
}
