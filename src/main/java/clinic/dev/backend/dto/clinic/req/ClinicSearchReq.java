package clinic.dev.backend.dto.clinic.req;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record ClinicSearchReq(
    String name,
    String phone,
    String email,
    @Min(0) Integer page,
    @Min(1) @Max(100) Integer size) {
  public Pageable getPageable() {
    int safePage = page != null ? page : 0;
    int safeSize = size != null ? size : 10;
    return PageRequest.of(safePage, safeSize);
  }
}
