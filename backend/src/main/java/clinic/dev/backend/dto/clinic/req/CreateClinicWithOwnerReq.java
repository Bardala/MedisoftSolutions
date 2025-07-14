package clinic.dev.backend.dto.clinic.req;

import clinic.dev.backend.dto.user.UserReqDTO;
import jakarta.validation.Valid;

public record CreateClinicWithOwnerReq(
    @Valid ClinicReqDTO clinic,
    @Valid ClinicLimitsReqDTO limits,
    @Valid UserReqDTO owner) {
}