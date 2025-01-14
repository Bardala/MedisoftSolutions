package clinic.dev.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomErrorHandler {

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDeniedException() {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleGenericException(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
  }
}
