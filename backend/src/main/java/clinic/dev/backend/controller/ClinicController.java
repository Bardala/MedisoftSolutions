package clinic.dev.backend.controller;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.service.impl.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/clinics")
@RequiredArgsConstructor
public class ClinicController {

  private final ClinicService clinicService;

  @GetMapping
  public ResponseEntity<List<ClinicResDTO>> getAllClinics() {
    return ResponseEntity.ok(clinicService.getAllClinics());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ClinicResDTO> getClinic(@PathVariable("id") Long id) {
    return ResponseEntity.ok(clinicService.getClinicById(id));
  }

  @PostMapping
  public ResponseEntity<ClinicResDTO> createClinic(
      @RequestBody @Valid ClinicReqDTO request) {
    ClinicResDTO response = clinicService.createClinic(request);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ClinicResDTO> updateClinic(
      @PathVariable("id") Long id,
      @RequestBody @Valid ClinicReqDTO request) {
    return ResponseEntity.ok(clinicService.updateClinic(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteClinic(@PathVariable Long id) {
    clinicService.deleteClinic(id);
    return ResponseEntity.noContent().build();
  }

  // Nested endpoints for settings/limits
  @PutMapping("/{id}/settings")
  public ResponseEntity<ClinicSettingsResDTO> updateSettings(
      @PathVariable("id") Long id,
      @RequestBody @Valid ClinicSettingsReqDTO request) {
    return ResponseEntity.ok(clinicService.updateSettings(id, request));
  }

  @PutMapping("/{id}/limits")
  public ResponseEntity<ClinicLimitsResDTO> updateLimits(
      @PathVariable("id") Long id,
      @RequestBody @Valid ClinicLimitsReqDTO request) {
    return ResponseEntity.ok(clinicService.updateLimits(id, request));
  }
}