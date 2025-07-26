package clinic.dev.backend.controller;

import clinic.dev.backend.dto.clinic.res.ClinicUsageResDTO;
import clinic.dev.backend.service.impl.ClinicUsageService;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clinic-usage")
public class ClinicUsageController {
  @Autowired
  private ClinicUsageService clinicUsageService;

  @GetMapping("/{clinicId}")
  public ResponseEntity<ApiRes<ClinicUsageResDTO>> getClinicUsage(@PathVariable Long clinicId) {
    ClinicUsageResDTO usage = clinicUsageService.getClinicUsage(clinicId);

    return ResponseEntity.ok(new ApiRes<>(usage));
  }
}