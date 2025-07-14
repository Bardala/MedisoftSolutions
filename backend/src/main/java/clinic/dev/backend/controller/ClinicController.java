package clinic.dev.backend.controller;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSearchReq;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.req.CreateClinicWithOwnerReq;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicWithOwnerRes;
import clinic.dev.backend.service.impl.ClinicService;
import clinic.dev.backend.util.ApiRes;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/clinics")
@RequiredArgsConstructor
public class ClinicController {

  private final ClinicService clinicService;

  @GetMapping("/user-clinic")
  public ResponseEntity<ApiRes<ClinicResDTO>> getClinic() {
    return ResponseEntity.ok(new ApiRes<>(clinicService.getUserClinic()));
  }

  @PutMapping
  @PreAuthorize("@auth.isOwner()")
  public ResponseEntity<ApiRes<ClinicResDTO>> updateClinic(@RequestBody @Valid ClinicReqDTO request) {
    return ResponseEntity.ok(new ApiRes<>(clinicService.updateClinic(request)));
  }

  @GetMapping("/settings")
  public ResponseEntity<ApiRes<ClinicSettingsResDTO>> getCurrentClinicSettings() {
    return ResponseEntity.ok(new ApiRes<>((clinicService.getSettings())));
  }

  @PutMapping("/settings")
  @PreAuthorize("@auth.isOwner()")
  public ResponseEntity<ApiRes<ClinicSettingsResDTO>> updateCurrentClinicSettings(
      @RequestBody @Valid ClinicSettingsReqDTO request) {
    return ResponseEntity.ok(new ApiRes<>(clinicService.updateSettings(request)));
  }

  @GetMapping("/limits")
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> getCurrentClinicLimits() {
    return ResponseEntity.ok(new ApiRes<>((clinicService.getLimits())));
  }

  @PostMapping
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<ClinicResDTO>> createClinic(
      @RequestBody @Valid ClinicReqDTO request) {
    ClinicResDTO response = clinicService.createClinic(request);
    return ResponseEntity.ok(new ApiRes<>(response));
  }

  @GetMapping("/{id}")
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<ClinicResDTO>> getClinic(@PathVariable("id") Long id) {

    return ResponseEntity.ok(new ApiRes<>(clinicService.getClinicById(id)));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<Void>> deleteClinic(@PathVariable("id") Long id) {

    clinicService.deleteClinic(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}/limits")
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> getClinicLimits(
      @PathVariable("id") Long id) {

    return ResponseEntity.ok(new ApiRes<>(clinicService.getLimitsById(id)));
  }

  @PutMapping("/{id}/limits")
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<ClinicLimitsResDTO>> updateClinicLimits(
      @PathVariable("id") Long id,
      @RequestBody @Valid ClinicLimitsReqDTO request) {

    return ResponseEntity.ok(new ApiRes<>(clinicService.updateLimits(request, id)));
  }

  @GetMapping
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<Page<ClinicResDTO>>> getClinics(@Valid @ModelAttribute ClinicSearchReq req) {
    Page<ClinicResDTO> result = clinicService.searchClinics(req);
    return ResponseEntity.ok(new ApiRes<>(result));
  }

  @PostMapping("/with-owner")
  @PreAuthorize("@auth.isSuperAdmin()")
  public ResponseEntity<ApiRes<ClinicWithOwnerRes>> createClinicWithOwner(
      @Valid @RequestBody CreateClinicWithOwnerReq request) {
    ClinicWithOwnerRes response = clinicService.createClinicWithOwner(
        request.clinic(),
        request.limits(),
        request.owner());
    return ResponseEntity.ok(new ApiRes<>(response));
  }
}
