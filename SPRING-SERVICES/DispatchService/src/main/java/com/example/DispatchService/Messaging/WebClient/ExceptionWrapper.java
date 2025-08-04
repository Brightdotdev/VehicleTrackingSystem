package com.example.DispatchService.Messaging.WebClient;


import com.example.DispatchService.Exceptions.AccessException;
import com.example.DispatchService.Exceptions.ConflictException;
import com.example.DispatchService.Exceptions.NotFoundException;
import com.example.DispatchService.Utils.ApiResponse;
import org.slf4j.LoggerFactory;
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

    public static void runSafely(RunnableWithExceptions runnable) {
        try {
            runnable.run();
        } catch (Exception ex) {
            LoggerFactory.getLogger(ExceptionWrapper.class).error("Unhandled exception caught in runSafely", ex);
            // Optionally rethrow or route to dead-letter queue depending on policy
        }
    }

    @FunctionalInterface
    public interface SupplierWithExceptions<T> {
        T get() throws Exception;
    }

    @FunctionalInterface
    public interface RunnableWithExceptions {
        void run() throws Exception;
    }
}
