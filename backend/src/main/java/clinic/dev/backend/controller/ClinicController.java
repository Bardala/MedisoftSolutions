package clinic.dev.backend.controller;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.service.impl.ClinicService;
import clinic.dev.backend.util.ApiRes;
import clinic.dev.backend.util.AuthContext;
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
  private final AuthContext authContext;

  @GetMapping("/user-clinic")
  public ResponseEntity<ApiRes<ClinicResDTO>> getClinic() {
    return ResponseEntity.ok(new ApiRes<>(clinicService.getUserClinic()));
  }

  @PutMapping
  public ResponseEntity<ApiRes<ClinicResDTO>> updateClinic(@RequestBody @Valid ClinicReqDTO request) {
    return ResponseEntity.ok(new ApiRes<>(clinicService.updateClinic(request)));
  }

  // Settings endpoints
  @GetMapping("/settings")
  public ResponseEntity<ApiRes<ClinicSettingsResDTO>> getCurrentClinicSettings() {
    return ResponseEntity.ok(new ApiRes<>((clinicService.getSettings())));
  }

  @PutMapping("/settings")
  public ResponseEntity<ApiRes<ClinicSettingsResDTO>> updateCurrentClinicSettings(
      @RequestBody @Valid ClinicSettingsReqDTO request) {
    return ResponseEntity.ok(new ApiRes<>(clinicService.updateSettings(request)));
  }

  // Limits endpoints
  @GetMapping("/limits")
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> getCurrentClinicLimits() {
    return ResponseEntity.ok(new ApiRes<>((clinicService.getLimits())));
  }

  // APIs For system dashboard admin
  @GetMapping
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<List<ClinicResDTO>>> getAllClinics() {
    if (!authContext.isSuperAdmin())
      throw new UnauthorizedAccessException("Only SuperAdmin can create clinics");

    return ResponseEntity.ok(new ApiRes<>(clinicService.getAllClinics()));
  }

  @PostMapping
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<ClinicResDTO>> createClinic(
      @RequestBody @Valid ClinicReqDTO request) {
    if (!authContext.isSuperAdmin())
      throw new UnauthorizedAccessException("Only SuperAdmin can create clinics");

    ClinicResDTO response = clinicService.createClinic(request);
    return ResponseEntity.ok(new ApiRes<>(response));
  }

  @GetMapping("/{id}")
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<ClinicResDTO>> getClinic(@PathVariable("id") Long id) {
    if (!authContext.isSuperAdmin())
      throw new UnauthorizedAccessException("Only SuperAdmin can create clinics");

    return ResponseEntity.ok(new ApiRes<>(clinicService.getClinicById(id)));
  }

  @DeleteMapping("/{id}")
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<Void>> deleteClinic(@PathVariable("id") Long id) {
    if (!authContext.isSuperAdmin())
      throw new UnauthorizedAccessException("Only SuperAdmin can create clinics");

    clinicService.deleteClinic(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/limits")
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> getClinicLimits(
      @PathVariable("id") Long id) {

    return ResponseEntity.ok(new ApiRes<>(clinicService.getLimitsById(id)));
  }

  @PutMapping("/{id}/limits")
  /** @apiNote For system dashboard admin */
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> updateClinicLimits(
      @PathVariable("id") Long id,
      @RequestBody @Valid ClinicLimitsReqDTO request) {
    if (!authContext.isSuperAdmin())
      throw new UnauthorizedAccessException("Only SuperAdmin can create clinics");

    return ResponseEntity.ok(new ApiRes<>(clinicService.updateLimits(request, id)));
  }
}