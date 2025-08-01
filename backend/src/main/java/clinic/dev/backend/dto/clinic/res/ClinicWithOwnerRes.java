package clinic.dev.backend.dto.clinic.res;

import clinic.dev.backend.dto.user.UserResDTO;

public record ClinicWithOwnerRes(
    ClinicResDTO clinic,
    UserResDTO owner,
    ClinicLimitsResDTO limits,
    ClinicBillingPlanResDTO plan) {
}