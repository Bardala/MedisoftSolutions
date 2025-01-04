package clinic.dev.backend.controller;

import clinic.dev.backend.model.Patient;
import clinic.dev.backend.service.impl.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

  @Autowired
  private PatientService patientService;

  @PostMapping
  public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
    Patient createdPatient = patientService.create(patient);
    return ResponseEntity.ok(createdPatient);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
    Patient updatedPatient = patientService.update(id, patient);
    return ResponseEntity.ok(updatedPatient);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
    patientService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
    Patient patient = patientService.getById(id);
    return ResponseEntity.ok(patient);
  }

  @GetMapping
  public ResponseEntity<List<Patient>> getAllPatients() {
    List<Patient> patients = patientService.getAll();
    return ResponseEntity.ok(patients);
  }
}
