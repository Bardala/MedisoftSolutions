package clinic.dev.backend.controller;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.service.impl.PatientService;
import clinic.dev.backend.util.ApiRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<Patient>> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
    Patient updatedPatient = patientService.update(id, patient);
    return ResponseEntity.ok(new ApiRes<>(updatedPatient));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deletePatient(@PathVariable Long id) {
    patientService.delete(id);
    return ResponseEntity.noContent().build();
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
  public ResponseEntity<ApiRes<PatientRegistryRes>> getPatientRegistry(@PathVariable Long id) {
    PatientRegistryRes patientRegistry = patientService.getPatientRegistry(id);
    return ResponseEntity.ok(new ApiRes<>(patientRegistry));
  }

  @GetMapping("/registry")
  public ResponseEntity<ApiRes<List<PatientRegistryRes>>> getRegistry() {
    List<PatientRegistryRes> registry = patientService.AllPatientsRegistry();
    return ResponseEntity.ok(new ApiRes<>(registry));
  }
}
