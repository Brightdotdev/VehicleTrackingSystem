package com.tracker.loggingtrackingservice.G.V1.Exceptions;

public class InvalidTaskRequestException extends RuntimeException {

    private int errorCode;
    public InvalidTaskRequestException(String message) {
        super(message);
    }

    public int getErrorCode() {
        return errorCode;
    }
}
