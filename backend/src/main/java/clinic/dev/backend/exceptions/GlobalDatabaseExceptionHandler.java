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

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
  public ResponseEntity<ApiRes<String>> handleJpaSystemException(JpaSystemException ex) {
    String rawMsg = ex.getMessage();
    String formatFieldName = extractConstraintViolationMessage(rawMsg);
    String userFriendlyMessage = formatFieldName;

    Map<String, String> errorField = Map.of(formatFieldName, userFriendlyMessage);
    ApiRes<String> res = new ApiRes<>(errorField);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
  }

  private String extractConstraintViolationMessage(String rawMessage) {
    Pattern uniqueConstraintPattern = Pattern.compile("UNIQUE\\sconstraint\\sfailed:\\s(\\w+\\.\\w+)");
    Matcher matcher = uniqueConstraintPattern.matcher(rawMessage);

    if (matcher.find()) {
      String violatedField = matcher.group(1).split("\\.")[1];

      // Remove underscores and format properly
      String formattedField = formatFieldName(violatedField);
      return formattedField + " is already registered. Please enter another value.";
    }

    return "A database error occurred. Please try again.";
  }

  private String formatFieldName(String field) {
    // Replace underscores with spaces and capitalize first letter of each word
    String[] words = field.split("_");
    StringBuilder formattedName = new StringBuilder();

    for (String word : words) {
      formattedName.append(Character.toUpperCase(word.charAt(0)))
          .append(word.substring(1))
          .append(" ");
    }

    return formattedName.toString().trim();
  }

}
