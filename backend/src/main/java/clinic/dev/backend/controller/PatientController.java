package clinic.dev.backend.controller;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.dto.patient.PatientReqDTO;
import clinic.dev.backend.dto.patient.PatientResDTO;
import clinic.dev.backend.dto.patient.statistics.PatientStatisticsDTO;
import clinic.dev.backend.service.PatientServiceBase;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {

  @Autowired
  private PatientServiceBase patientService;

  @PostMapping
  @PreAuthorize("@planValidation.canCreatePatient()")
  public ResponseEntity<ApiRes<PatientResDTO>> createPatient(@Valid @RequestBody PatientReqDTO req) {
    PatientResDTO createdPatient = patientService.create(req);
    return ResponseEntity.ok(new ApiRes<>(createdPatient));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<PatientResDTO>> updatePatient(
      @PathVariable("id") Long id,
      @Valid @RequestBody PatientReqDTO req) {
    PatientResDTO response = patientService.update(id, req);
    return ResponseEntity.ok(new ApiRes<>(response));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@planValidation.canCreatePatient()")
  public ResponseEntity<ApiRes<String>> deletePatient(@PathVariable("id") Long id) {
    patientService.delete(id);
    return ResponseEntity.ok(new ApiRes<>("Patient Deleted Successfully"));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<PatientResDTO>> getPatientById(@PathVariable("id") Long id) {
    PatientResDTO patient = patientService.getClinicPatientById(id);
    return ResponseEntity.ok(new ApiRes<>(patient));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<PatientResDTO>>> getAllPatients() {
    List<PatientResDTO> patients = patientService.getAll().stream().map((PatientResDTO::fromEntity)).toList();
    return ResponseEntity.ok(new ApiRes<>(patients));
  }

  @GetMapping("/registry/{id}")
  public ResponseEntity<ApiRes<PatientRegistryRes>> getPatientRegistry(@PathVariable("id") Long id) {
    PatientRegistryRes patientRegistry = patientService.getPatientRegistry(id);
    return ResponseEntity.ok(new ApiRes<>(patientRegistry));
  }

  @GetMapping("/registry")
  public ResponseEntity<ApiRes<List<PatientRegistryRes>>> getRegistry() {
    List<PatientRegistryRes> registry = patientService.AllPatientsRegistry();
    return ResponseEntity.ok(new ApiRes<>(registry));
  }

  @GetMapping("/dailyNew")
  @PreAuthorize("!hasRole('DOCTOR')")
  public ResponseEntity<ApiRes<List<PatientResDTO>>> getDailyNewPatients(
      @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    // If no date is provided, use the current date
    if (date == null) {
      date = LocalDate.now();
    }
    List<PatientResDTO> patients = patientService.getDailyNewPatientsForDate(date);
    return ResponseEntity.ok(new ApiRes<>(patients));
  }

  @GetMapping("/search")
  public ResponseEntity<ApiRes<Page<PatientResDTO>>> searchPatients(
      @RequestParam Map<String, String> allParams,
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {

    // Remove pagination parameters from the search criteria
    Map<String, String> searchParams = new HashMap<>(allParams);
    searchParams.remove("page");
    searchParams.remove("size");

    Page<PatientResDTO> patients = patientService.searchPatients(searchParams, page, size);
    return ResponseEntity.ok(new ApiRes<>(patients));
  }

  @GetMapping("/batch")
  public ResponseEntity<ApiRes<List<PatientResDTO>>> getPatientsByIds(
      @RequestParam List<Long> ids) {
    List<PatientResDTO> patients = patientService.getPatientsByIds(ids);
    return ResponseEntity.ok(new ApiRes<>(patients));
  }

  @GetMapping("/statistics")
  public ResponseEntity<ApiRes<PatientStatisticsDTO>> getPatientStatistics() {
    PatientStatisticsDTO statistics = patientService.getPatientStatistics();
    return ResponseEntity.ok(new ApiRes<>(statistics));
  }
}
