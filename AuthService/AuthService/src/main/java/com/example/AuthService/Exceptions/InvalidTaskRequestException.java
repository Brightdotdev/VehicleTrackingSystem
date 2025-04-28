package com.example.AuthService.Exceptions;

public class InvalidTaskRequestException extends RuntimeException {

    private int errorCode;
    public InvalidTaskRequestException(String message, int errorCode) {
        super(message);
    }

    public int getErrorCode() {
        return errorCode;
    }
}
