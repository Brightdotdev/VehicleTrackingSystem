package com.example.DispatchService.Exceptions;

public class InvalidRequestException extends RuntimeException {

    private int errorCode;
    public InvalidRequestException(String message, int errorCode) {
        super(message);
    }

    public int getErrorCode() {
        return errorCode;
    }
}
