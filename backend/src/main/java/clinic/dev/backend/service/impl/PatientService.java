package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService implements BaseService<Patient> {

  @Autowired
  private PatientRepo patientRepo;

  @Autowired
  private VisitRepo visitRepo;

  @Autowired
  private PaymentRepo paymentRepo;

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

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

    if (patientRepo.existsByFullName(updatedPatient.getFullName())) {
      throw new IllegalArgumentException("This name already exists, change it");
    }

    existingPatient.setFullName(updatedPatient.getFullName());
    existingPatient.setPhone(updatedPatient.getPhone());
    existingPatient.setAddress(updatedPatient.getAddress());
    existingPatient.setAge(updatedPatient.getAge());
    // existingPatient.setDateOfBirth(updatedPatient.getDateOfBirth());
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

  public void deleteAll() {
    patientRepo.deleteAll();
  }

  // todo: Create a native sql query for this method for avoiding redundancy data
  public PatientRegistryRes getPatientRegistry(Long id) {
    Patient patient = getById(id);
    PatientRegistryRes dto = new PatientRegistryRes();

    dto.setPatient(patient);
    dto.setVisits(visitRepo.findByPatientId(patient.getId()));
    dto.setPayments(paymentRepo.findByPatientId(patient.getId()));
    dto.setVisitDentalProcedure(visitDentalProcedureRepo.findByVisitPatientId(patient.getId()));
    dto.setMedicines(visitMedicineRepo.findByVisitPatientId(patient.getId()));
    dto.setVisitPayments(visitPaymentRepo.findByVisitPatientId(patient.getId()));
    return dto;
  }

  public List<PatientRegistryRes> AllPatientsRegistry() {
    List<Patient> patients = patientRepo.findAll();
    return patients.stream().map(patient -> {
      return getPatientRegistry(patient.getId());
    }).collect(Collectors.toList());
  }

  public List<Patient> dailyNewPatients() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    return patientRepo.findAll().stream()
        .filter(
            patient -> !patient.getCreatedAt().isBefore(workdayStart) && patient.getCreatedAt().isBefore(workdayEnd))
        .collect(Collectors.toList());
  }
}