package clinic.dev.backend.service.impl;

import clinic.dev.backend.exceptions.ResourceNotFoundException;
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
    if (patientRepo.existsByFullName(patient.getFullName())) {
      throw new IllegalArgumentException("This name already exists, change it.");
    }

    return patientRepo.save(patient);
  }

  @Override
  public Patient update(Long id, Patient updatedPatient) {
    Patient existingPatient = getById(id);

    if (existingPatient == null) {
      throw new ResourceNotFoundException("Patient not found;");
    }

    if (patientRepo.existsByFullName(updatedPatient.getFullName())) {
      throw new IllegalArgumentException("This name already exists, change it");
    }

    existingPatient.setFullName(updatedPatient.getFullName());
    existingPatient.setPhone(updatedPatient.getPhone());
    existingPatient.setAddress(updatedPatient.getAddress());
    existingPatient.setAge(updatedPatient.getAge());
    existingPatient.setDateOfBirth(updatedPatient.getDateOfBirth());
    existingPatient.setNotes(updatedPatient.getNotes());
    existingPatient.setMedicalHistory(updatedPatient.getMedicalHistory());

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
