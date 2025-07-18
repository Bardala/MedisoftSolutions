package clinic.dev.backend.dto.clinic.res;

import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.User;

public record ClinicWithOwnerRes(
    Clinic clinic,
    User owner,
    ClinicLimits limits) {
}