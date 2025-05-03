package clinic.dev.backend.controller;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.service.impl.PatientService;
import clinic.dev.backend.util.ApiRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
  private PatientService patientService;

  @PostMapping
  public ResponseEntity<ApiRes<Patient>> createPatient(@RequestBody Patient patient) {
    Patient createdPatient = patientService.create(patient);
    return ResponseEntity.ok(new ApiRes<>(createdPatient));
  }

  @PutMapping()
  public ResponseEntity<ApiRes<Patient>> updatePatient(@RequestBody Patient patient) {
    Patient updatedPatient = patientService.update(patient);
    return ResponseEntity.ok(new ApiRes<>(updatedPatient));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<String>> deletePatient(@PathVariable Long id) {
    patientService.delete(id);
    return ResponseEntity.ok(new ApiRes<>("Patient Deleted Successfully"));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<Patient>> getPatientById(@PathVariable Long id) {
    Patient patient = patientService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(patient));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<Patient>>> getAllPatients() {
    List<Patient> patients = patientService.getAll();
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
  public ResponseEntity<ApiRes<List<Patient>>> getDailyNewPatients(
      @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    // If no date is provided, use the current date
    if (date == null) {
      date = LocalDate.now();
    }
    List<Patient> patients = patientService.getDailyNewPatientsForDate(date);
    return ResponseEntity.ok(new ApiRes<>(patients));
  }

  @GetMapping("/search")
  public ResponseEntity<ApiRes<Page<Patient>>> searchPatients(
      @RequestParam Map<String, String> allParams,
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "20") int size) {

    // Remove pagination parameters from the search criteria
    Map<String, String> searchParams = new HashMap<>(allParams);
    searchParams.remove("page");
    searchParams.remove("size");

    Page<Patient> patients = patientService.searchPatients(searchParams, page, size);
    return ResponseEntity.ok(new ApiRes<>(patients));
  }
}
