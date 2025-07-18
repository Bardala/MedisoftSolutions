package clinic.dev.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

  @Override
  public void initialize(StrongPassword constraintAnnotation) {
  }

  @Override
  public boolean isValid(String password, ConstraintValidatorContext context) {
    // Define your strong password criteria here
    return password != null && password.length() >= 8 &&
        password.matches(".*[A-Z].*") && // At least one uppercase letter
        password.matches(".*[a-z].*") && // At least one lowercase letter
        password.matches(".*\\d.*") && // At least one digit
        password.matches(".*[@#$%^&+=].*"); // At least one special character
  }
}
