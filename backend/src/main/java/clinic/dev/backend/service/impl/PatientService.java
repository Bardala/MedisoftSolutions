package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;
import jakarta.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

  @Autowired
  private QueueRepo queueRepo;

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
    queueRepo.deleteByPatientId(id);
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
  public List<Patient> getDailyNewPatientsForDate(LocalDate date) {
    LocalDateTime workdayStart = date.atTime(6, 0); // 6 AM on the given date
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM the next day

    // If the date is today and the current time is before 6 AM, adjust the period
    if (date.isEqual(LocalDate.now()) && LocalDateTime.now().isBefore(workdayStart)) {
      LocalDateTime at12Am = date.atTime(LocalTime.MIN); // 12 AM on the given date
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM on the given date

      List<Patient> patientsFrom0to6Am = getPatientsAtThisPeriod(at12Am, at6Am);

      // Get patients from the previous day (6 AM to 12 AM)
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));
      List<Patient> patientsAfter6AmYesterday = getPatientsAtThisPeriod(after6AmYesterday, at12Am);

      patientsFrom0to6Am.addAll(patientsAfter6AmYesterday);

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

  // @Transactional(readOnly = true)
  // public Page<Patient> searchPatients(String searchTerm, int page, int size) {
  // // Fetch all patients (consider adding a method to fetch in batches for large
  // // datasets)
  // List<Patient> allPatients = patientRepo.findAll();

  // // Filter patients based on search term
  // List<Patient> filteredPatients = allPatients.stream()
  // .filter(patient ->
  // patient.getFullName().toLowerCase().contains(searchTerm.toLowerCase()) ||
  // patient.getPhone().contains(searchTerm))
  // .collect(Collectors.toList());

  // // Implement pagination manually
  // return paginateList(filteredPatients, page, size);
  // }

  @Transactional(readOnly = true)
  public Page<Patient> searchPatients(Map<String, String> searchParams, int page, int size) {
    Specification<Patient> spec = (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      for (Map.Entry<String, String> entry : searchParams.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();

        switch (key.toLowerCase()) {
          case "patient":
            // Search in both fullName and phone
            predicates.add(cb.or(
                cb.like(cb.lower(root.get("fullName")), "%" + value.toLowerCase() + "%"),
                cb.like(root.get("phone"), "%" + value + "%")));
            break;
          case "fullname":
          case "full_name":
            predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + value.toLowerCase() + "%"));
            break;
          case "phone":
            predicates.add(cb.like(root.get("phone"), "%" + value + "%"));
            break;
          case "address":
            predicates.add(cb.like(cb.lower(root.get("address")), "%" + value.toLowerCase() + "%"));
            break;
          case "age":
            if (value.matches("\\d+")) {
              predicates.add(cb.equal(root.get("age"), Integer.parseInt(value)));
            }
            break;
          case "medical_history":
          case "medicalhistory":
            predicates.add(cb.like(cb.lower(root.get("medicalHistory")), "%" + value.toLowerCase() + "%"));
            break;
          // Add more fields as needed
        }
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };

    return patientRepo.findAll(spec, PageRequest.of(page, size));
  }

  // private Page<Patient> paginateList(List<Patient> items, int page, int size) {
  // // Validate page and size
  // size = Math.min(size, 20); // Ensure max 20 items per page
  // int totalItems = items.size();
  // // int totalPages = (int) Math.ceil((double) totalItems / size);

  // // Calculate start and end index
  // int start = Math.min(page * size, totalItems);
  // int end = Math.min((page + 1) * size, totalItems);

  // // Get sublist for current page
  // List<Patient> pageContent = items.subList(start, end);

  // // Create Page object
  // return new PageImpl<>(
  // pageContent,
  // PageRequest.of(page, size),
  // totalItems);
  // }
}