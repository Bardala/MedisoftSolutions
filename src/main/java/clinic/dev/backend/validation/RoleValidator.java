package clinic.dev.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class RoleValidator implements ConstraintValidator<RoleConstraint, String> {

  private final List<String> acceptedRoles = Arrays.asList("Doctor", "Assistant", "Owner", "SuperAdmin");

  @Override
  public void initialize(RoleConstraint constraintAnnotation) {
  }

  @Override
  public boolean isValid(String role, ConstraintValidatorContext context) {
    return role != null && acceptedRoles.contains(role);
  }
}
