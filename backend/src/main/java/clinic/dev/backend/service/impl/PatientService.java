package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

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

  @Autowired
  private PatientFileService patientFileService;

  @Transactional
  public Patient create(Patient patient) {
    if (patientRepo.existsByFullName(patient.getFullName())) {
      throw new IllegalArgumentException("This name already exists, change it.");
    }

    return patientRepo.save(patient);
  }

  @Transactional
  public Patient update(Patient updatedPatient) {
    return patientRepo.save(updatedPatient);
  }

  @Transactional
  public void delete(Long id) {
    visitPaymentRepo.deleteByVisitPatientId(id);
    visitMedicineRepo.deleteByVisitPatientId(id);
    visitDentalProcedureRepo.deleteByVisitPatientId(id);
    visitRepo.deleteByPatientId(id);
    paymentRepo.deleteByPatientId(id);

    patientFileService.deletePatientFiles(id);

    patientRepo.deleteById(id);
  }

  public Patient getById(Long id) {
    return patientRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
  }

  public List<Patient> getAll() {
    return patientRepo.findAll();
  }

  @Transactional
  public void deleteAll() {
    patientRepo.deleteAll();
  }

  // todo: Create a native sql query for this method for avoiding redundancy data
  @Transactional(readOnly = true)
  public PatientRegistryRes getPatientRegistry(Long id) {
    Patient patient = getById(id);
    PatientRegistryRes dto = new PatientRegistryRes();

    dto.setPatient(patient);
    dto.setVisits(visitRepo.findByPatientId(patient.getId()));
    dto.setPayments(paymentRepo.findByPatientId(patient.getId()));
    dto.setVisitDentalProcedure(visitDentalProcedureRepo.findByVisitPatientId(patient.getId()));
    dto.setVisitMedicines(visitMedicineRepo.findByVisitPatientId(patient.getId()));
    dto.setVisitPayments(visitPaymentRepo.findByVisitPatientId(patient.getId()));
    return dto;
  }

  @Transactional(readOnly = true)
  public List<PatientRegistryRes> AllPatientsRegistry() {
    List<Patient> patients = patientRepo.findAll();
    return patients.stream().map(patient -> {
      return getPatientRegistry(patient.getId());
    }).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<Patient> dailyNewPatients() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.with(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // if the current time is after 12 AM and before 6 AM
    if (referenceDate.isBefore(workdayStart)) {
      LocalDateTime at12Am = referenceDate.with(LocalTime.MIN); // 12 AM today
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM today

      List<Patient> patientsFrom0to6Am = getPatientsAtThisPeriod(at12Am, at6Am);

      // Now we have to get the patients from the previous day from 6 AM to 12 AM
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));

      List<Patient> patientsAfter6AmYesterday = getPatientsAtThisPeriod(after6AmYesterday, at12Am);

      patientsFrom0to6Am.addAll(patientsAfter6AmYesterday);

      return patientsFrom0to6Am;
    }

    return getPatientsAtThisPeriod(workdayStart, workdayEnd);
  }

  @Transactional(readOnly = true)
  public List<Patient> getDayNewPatients(LocalDateTime date) {
    LocalDateTime referenceDate = date;
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // if the current time is after 12am and before 6am
    if (referenceDate.isBefore(workdayStart)) {
      LocalDateTime at12Am = referenceDate.toLocalDate().atTime(LocalTime.of(0, 0)); // let the day starts at 12am
      LocalDateTime at6Am = at12Am.plusHours(6); // let the day ends at 6am

      List<Patient> patientsFrom0to6Am = getPatientsAtThisPeriod(at12Am, at6Am);

      // Now we have to get the patient of the day before from 6am to 12am
      LocalDateTime after6AmYesterday = at12Am.minusHours(18);

      List<Patient> patientsAfter6AmYesterday = getPatientsAtThisPeriod(after6AmYesterday, at12Am);

      for (int i = 0; i < patientsAfter6AmYesterday.size() - 1; i++) {
        patientsFrom0to6Am.add(patientsAfter6AmYesterday.get(i));
      }

      return patientsFrom0to6Am;
    }

    return getPatientsAtThisPeriod(workdayStart, workdayEnd);
  }

  @Transactional(readOnly = true)
  public List<Patient> getPatientsAtThisPeriod(LocalDateTime start, LocalDateTime end) {
    return patientRepo.findAll().stream()
        .filter(
            patient -> !patient.getCreatedAt().isBefore(start) && patient.getCreatedAt().isBefore(end))
        .collect(Collectors.toList());
  }

}