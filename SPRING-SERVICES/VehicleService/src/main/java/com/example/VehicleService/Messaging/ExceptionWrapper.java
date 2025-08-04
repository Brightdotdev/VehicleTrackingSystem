package com.example.VehicleService.Messaging;

import com.example.VehicleService.Exceptions.AccessException;
import com.example.VehicleService.Exceptions.ConflictException;
import com.example.VehicleService.Exceptions.NotFoundException;
import com.example.VehicleService.Utils.ApiResponse;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;

public class ExceptionWrapper {
    public static <T> ResponseEntity<ApiResponse<T>> wrapExceptions(SupplierWithExceptions<ResponseEntity<ApiResponse<T>>> handler) {
        try {
            return handler.get();
        } catch (NotFoundException ex) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, ex.getMessage()));
        } catch (ConflictException ex) {
            return ResponseEntity.status(409).body(ApiResponse.error(409, ex.getMessage()));
        } catch (AccessException ex) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error(500, "Unexpected error: " + ex.getMessage()));
        }
    }


    @FunctionalInterface
    public interface SupplierWithResult<T> {
        T get() throws Exception;
    }


    public static <T> T handleAndReturn(SupplierWithResult<T> supplier, Logger logger, String context) {
        try {
            return supplier.get();
        } catch (Exception e) {
            logger.error("❌ Error in {}: {}", context, e.getMessage(), e);
            return null;
        }
    }

    @FunctionalInterface
    public interface SupplierWithExceptions<T> {
        T get() throws Exception;
    }
}
