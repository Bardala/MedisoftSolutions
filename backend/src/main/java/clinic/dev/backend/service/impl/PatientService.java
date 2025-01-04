package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Patient;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService implements BaseService<Patient> {

  @Autowired
  private PatientRepo patientRepo;

  @Override
  public Patient create(Patient patient) {
    return patientRepo.save(patient);
  }

  @Override
  public Patient update(Long id, Patient updatedPatient) {
    Patient existingPatient = getById(id);
    existingPatient.setName(updatedPatient.getName());
    existingPatient.setPhoneNumber(updatedPatient.getPhoneNumber());
    existingPatient.setAddress(updatedPatient.getAddress());
    return patientRepo.save(existingPatient);
  }

  @Override
  public void delete(Long id) {
    patientRepo.deleteById(id);
  }

  @Override
  public Patient getById(Long id) {
    return patientRepo.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
  }

  @Override
  public List<Patient> getAll() {
    return patientRepo.findAll();
  }
}
