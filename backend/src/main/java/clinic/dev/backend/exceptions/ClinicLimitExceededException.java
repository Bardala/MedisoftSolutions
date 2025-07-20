package clinic.dev.backend.exceptions;

public class ClinicLimitExceededException extends RuntimeException {
  public ClinicLimitExceededException(String msg) {
    super(msg);
  }

}
