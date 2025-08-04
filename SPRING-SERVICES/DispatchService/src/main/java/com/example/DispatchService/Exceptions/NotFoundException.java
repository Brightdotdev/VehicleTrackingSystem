package com.example.DispatchService.Exceptions;

public class NotFoundException extends  RuntimeException{

    public NotFoundException(String message) {
        super(message);
    }
}
