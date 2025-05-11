package clinic.dev.backend.exceptions;

public class UnauthorizedAccessException extends RuntimeException {
  public UnauthorizedAccessException(String message) {
    super(message);
  }
}