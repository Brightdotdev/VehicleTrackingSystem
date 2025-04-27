package com.example.UserTaskApplication;

import com.example.UserTaskApplication.Exceptions.AccessException;
import com.example.UserTaskApplication.Exceptions.ConflictException;
import com.example.UserTaskApplication.Exceptions.InvalidTaskRequestException;
import com.example.UserTaskApplication.Exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;


@ControllerAdvice
public class GlobalExceptionHandler {



    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(NotFoundException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                "DATA_NOT_FOUND",
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }



    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflicts(ConflictException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                "APPLICATION_CONFLICT_ERROR",
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(AccessException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccess(AccessException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                "ACCESS_DENIED",
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }


    @ExceptionHandler(InvalidTaskRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidTask(InvalidTaskRequestException ex) {
        ApiResponse<Void> response = ApiResponse.error(
                ex.getErrorCode(),
                ex.getMessage()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiResponse<Void> response = ApiResponse.error(
                "VALIDATION_ERROR",
                errorMessage
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
