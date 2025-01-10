package clinic.dev.backend.exceptions;

import clinic.dev.backend.util.ApiRes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // Handle resource not found exceptions
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiRes<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
    ApiRes<Object> response = new ApiRes<>(Map.of("error", ex.getMessage()));
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  // Handle validation errors (e.g., @NotBlank, @NotNull, etc.)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiRes<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    // Collecting all validation error messages
    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    ApiRes<Object> response = new ApiRes<>(errors);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  // Handle AuthenticationException (e.g., invalid credentials)
  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<ApiRes<String>> handleAuthException(AuthenticationException ex) {
    ApiRes<String> response = new ApiRes<>(Map.of("error", ex.getMessage()));
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  // Handle InvalidCredentialsException
  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ApiRes<String>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
    ApiRes<String> response = new ApiRes<>(Map.of("error", ex.getMessage()));
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
  }

  // Handle UserNotFoundException
  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ApiRes<String>> handleUserNotFoundException(UserNotFoundException ex) {
    ApiRes<String> response = new ApiRes<>(Map.of("error", ex.getMessage()));
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }

  // Handle IllegalArgumentException (bad request)
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiRes<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
    ApiRes<String> response = new ApiRes<>(Map.of("error", ex.getMessage()));
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }
}