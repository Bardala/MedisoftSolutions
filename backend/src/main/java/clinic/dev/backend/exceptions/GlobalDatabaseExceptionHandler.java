package clinic.dev.backend.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import clinic.dev.backend.constants.ErrorMsg;
import clinic.dev.backend.util.ApiRes;
import jakarta.persistence.EntityNotFoundException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalDatabaseExceptionHandler {

  // Handle PostgreSQL unique constraint violations
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ApiRes<?>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
    String errorMessage = extractPostgresConstraintMessage(ex.getMostSpecificCause().getMessage());
    Map<String, String> errorMap = createErrorMap("Database_error", errorMessage);
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ApiRes<>(errorMap));
  }

  @ExceptionHandler(SQLException.class)
  public ResponseEntity<ApiRes<?>> handleSQLException(SQLException ex) {
    String errorMessage = extractPostgresConstraintMessage(ex.getMessage());
    Map<String, String> errorMap = createErrorMap("Database_error", errorMessage);
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ApiRes<>(errorMap));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public ResponseEntity<ApiRes<?>> handleEntityNotFoundException(EntityNotFoundException ex) {
    Map<String, String> errorMap = createErrorMap("not_found", ErrorMsg.ENTITY_NOT_FOUND + ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiRes<>(errorMap));
  }

  @ExceptionHandler(JpaSystemException.class)
  public ResponseEntity<ApiRes<?>> handleJpaSystemException(JpaSystemException ex) {
    String errorMessage = extractPostgresConstraintMessage(
        ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage());
    Map<String, String> errorMap = createErrorMap("Database_error", errorMessage);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiRes<>(errorMap));
  }

  private Map<String, String> createErrorMap(String errorKey, String errorMessage) {
    Map<String, String> errorMap = new HashMap<>();
    errorMap.put(errorKey, errorMessage);
    return errorMap;
  }

  private String extractPostgresConstraintMessage(String rawMessage) {
    if (rawMessage == null) {
      return "Unknown database error";
    }

    // Pattern for PostgreSQL unique constraint violation
    Pattern uniqueConstraintPattern = Pattern.compile(
        "ERROR: duplicate key value violates unique constraint \"(\\w+)\"\\s+" +
            "Detail: Key \\(([^\\)]+)\\)=\\(([^\\)]+)\\) already exists\\.");

    Matcher matcher = uniqueConstraintPattern.matcher(rawMessage);
    if (matcher.find()) {
      String constraintName = matcher.group(1);
      String columns = matcher.group(2);
      String values = matcher.group(3);

      // Format a user-friendly message based on the constraint
      switch (constraintName) {
        case "ukm8nrq511mujkh4ae1suwryhn8": // Queue unique constraint
          return "This patient is already in the doctor's queue";
        case "users_username_key":
          return "Username already exists";
        case "users_phone_key":
          return "Phone number already registered";
        default:
          return String.format("The combination of %s (%s) already exists",
              formatColumnNames(columns), values);
      }
    }

    // Pattern for foreign key violations
    Pattern fkPattern = Pattern.compile(
        "ERROR: insert or update on table \"\\w+\" violates foreign key constraint \"(\\w+)\"");
    matcher = fkPattern.matcher(rawMessage);
    if (matcher.find()) {
      return "The operation cannot be completed because it references non-existent data";
    }

    // Default message if no specific pattern matches
    return ErrorMsg.DATABASE_CONSTRAINS_VIOLATION +
        (rawMessage.length() > 200 ? rawMessage.substring(0, 200) + "..." : rawMessage);
  }

  private String formatColumnNames(String columns) {
    // Split by comma and format each column name
    String[] columnArray = columns.split(",\\s*");
    StringBuilder formatted = new StringBuilder();

    for (String column : columnArray) {
      formatted.append(column.replace("_", " "))
          .append(", ");
    }

    // Remove trailing comma and space
    return formatted.length() > 0 ? formatted.substring(0, formatted.length() - 2) : "these fields";
  }
}