package clinic.dev.backend.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import clinic.dev.backend.constants.ErrorMsg;
import jakarta.persistence.EntityNotFoundException;

import java.sql.SQLIntegrityConstraintViolationException;

@ControllerAdvice
public class GlobalDatabaseExceptionHandler {

  // Handle Data Integrity Violations (e.g., Unique constraints, Foreign key
  // violations)
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(ErrorMsg.DATABASE_CONSTRAINS_VIOLATION + ex.getMostSpecificCause().getMessage());
  }

  @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
  public ResponseEntity<String> handleSQLIntegrityConstraintViolation(SQLIntegrityConstraintViolationException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorMsg.SQL_CONSTRAINS_VIOLATION + ex.getMessage());
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorMsg.ENTITY_NOT_FOUND + ex.getMessage());
  }

  @ExceptionHandler(JpaSystemException.class)
  public ResponseEntity<String> handleJpaSystemException(JpaSystemException ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ErrorMsg.DATABASE_ERROR + ex.getMessage());
  }
}
