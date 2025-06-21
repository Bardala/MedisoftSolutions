package clinic.dev.backend.exceptions;

public class BusinessValidationException extends RuntimeException {
  public BusinessValidationException(String msg) {
    super(msg);
  }
}
