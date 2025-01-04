package clinic.dev.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = RoleValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface RoleConstraint {
  String message() default "Invalid role";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
