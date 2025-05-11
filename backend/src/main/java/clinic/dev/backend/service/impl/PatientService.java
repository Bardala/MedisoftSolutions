package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.dto.patient.PatientReqDTO;
import clinic.dev.backend.dto.patient.PatientResDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;
import clinic.dev.backend.util.AuthContext;
import jakarta.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
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

  @Autowired
  private AuthContext authContext;

  @Transactional
  public PatientResDTO create(PatientReqDTO request) {
    Long clinicId = authContext.getClinicId();

    if (patientRepo.existsByFullNameAndClinicId(request.fullName(), clinicId))
      throw new IllegalArgumentException("Patient name already exists in this clinic");

    Patient patient = request.toEntity(new Clinic(clinicId));
    return PatientResDTO.fromEntity(patientRepo.save(patient));
  }

  @Transactional
  public PatientResDTO update(Long id, PatientReqDTO req) {
    Long clinicId = authContext.getClinicId();

    Patient existing = patientRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

    req.updateEntity(existing, new Clinic(clinicId));

    return PatientResDTO.fromEntity(patientRepo.save(existing));
  }

  @Transactional
  public void delete(Long id) {
    Long clinicId = authContext.getClinicId();
    // First verify the patient belongs to the clinic
    if (!patientRepo.existsByIdAndClinicId(id, clinicId)) {
      throw new UnauthorizedAccessException("Patient not found in your clinic");
    }

    queueRepo.deleteByPatientIdAndClinicId(id, clinicId);
    visitPaymentRepo.deleteByVisitPatientIdAndClinicId(id, clinicId);
    visitMedicineRepo.deleteByVisitPatientIdAndClinicId(id, clinicId);
    visitDentalProcedureRepo.deleteByVisitPatientIdAndClinicId(id, clinicId);
    visitRepo.deleteByPatientIdAndClinicId(id, clinicId);
    paymentRepo.deleteByPatientIdAndClinicId(id, clinicId);

    patientFileService.deletePatientFiles(id);

    patientRepo.deleteByIdAndClinicId(id, clinicId);
  }

  // Simplified getter using DTO
  @Transactional(readOnly = true)
  public PatientResDTO getClinicPatientById(Long id) {
    Long clinicId = authContext.getClinicId();
    return patientRepo.findByIdAndClinicId(id, clinicId)
        .map(PatientResDTO::fromEntity)
        .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
  }

  public List<Patient> getAll() {
    Long clinicId = authContext.getClinicId();
    return patientRepo.findAllByClinicId(clinicId);
  }

  @Transactional
  public void deleteAllByClinicId(Long clinicId) {
    authContext.validateAdminAccess(); // Will throw if not admin
    if (!authContext.getClinicId().equals(clinicId)) {
      throw new UnauthorizedAccessException("Not authorized for this clinic");
    }
    patientRepo.deleteAllByClinicId(clinicId);
  }

  @Transactional(readOnly = true)
  public PatientRegistryRes getPatientRegistry(Long id) {
    Long clinicId = authContext.getClinicId();
    PatientResDTO patient = getClinicPatientById(id);
    PatientRegistryRes dto = new PatientRegistryRes();

    dto.setPatient(patient);
    dto.setVisits(
        visitRepo.findByPatientIdAndClinicId(patient.id(), clinicId).stream().map(VisitResDTO::fromEntity).toList());
    dto.setPayments(paymentRepo.findByPatientIdAndClinicId(patient.id(), clinicId).stream()
        .map(PaymentResDTO::fromEntity).toList());
    dto.setVisitDentalProcedure(visitDentalProcedureRepo.findByVisitPatientIdAndClinicId(patient.id(), clinicId)
        .stream().map(VisitProcedureResDTO::fromEntity).toList());
    dto.setVisitMedicines(visitMedicineRepo.findByVisitPatientIdAndClinicId(patient.id(), clinicId).stream()
        .map(VisitMedicineResDTO::fromEntity).toList());
    dto.setVisitPayments(visitPaymentRepo.findByVisitPatientIdAndClinicId(patient.id(), clinicId).stream()
        .map(vp -> VisitPaymentResDTO.fromEntity(vp)).toList());
    return dto;
  }

  @Transactional(readOnly = true)
  public List<PatientRegistryRes> AllPatientsRegistry() {
    Long clinicId = authContext.getClinicId();
    List<Patient> patients = patientRepo.findAllByClinicId(clinicId);
    return patients.stream()
        .map(patient -> getPatientRegistry(patient.getId()))
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<PatientResDTO> dailyNewPatients() {
    Long clinicId = authContext.getClinicId();
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.with(LocalTime.of(6, 0));
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    if (referenceDate.isBefore(workdayStart)) {
      LocalDateTime at12Am = referenceDate.with(LocalTime.MIN);
      LocalDateTime at6Am = at12Am.plusHours(6);

      List<Patient> patientsFrom0to6Am = getPatientsAtThisPeriod(at12Am, at6Am, clinicId);
      List<PatientResDTO> result = patientsFrom0to6Am.stream()
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList());

      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));
      List<Patient> patientsAfter6AmYesterday = getPatientsAtThisPeriod(after6AmYesterday, at12Am, clinicId);

      result.addAll(patientsAfter6AmYesterday.stream()
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList()));

      return result;
    }

    return getPatientsAtThisPeriod(workdayStart, workdayEnd, clinicId).stream()
        .map(PatientResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<PatientResDTO> getDailyNewPatientsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();
    LocalDateTime workdayStart = date.atTime(6, 0);
    LocalDateTime workdayEnd = workdayStart.plusHours(24);

    if (date.isEqual(LocalDate.now()) && LocalDateTime.now().isBefore(workdayStart)) {
      LocalDateTime at12Am = date.atTime(LocalTime.MIN);
      LocalDateTime at6Am = at12Am.plusHours(6);

      List<Patient> patientsFrom0to6Am = getPatientsAtThisPeriod(at12Am, at6Am, clinicId);
      List<PatientResDTO> result = patientsFrom0to6Am.stream()
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList());

      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));
      List<Patient> patientsAfter6AmYesterday = getPatientsAtThisPeriod(after6AmYesterday, at12Am, clinicId);

      result.addAll(patientsAfter6AmYesterday.stream()
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList()));

      return result;
    }

    return getPatientsAtThisPeriod(workdayStart, workdayEnd, clinicId).stream()
        .map(PatientResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public Page<PatientResDTO> searchPatients(Map<String, String> searchParams, int page, int size) {
    Long clinicId = authContext.getClinicId();

    Specification<Patient> spec = (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Filter by clinic ID through the clinic association
      predicates.add(cb.equal(root.get("clinic").get("id"), clinicId));

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

    Page<Patient> patientPage = patientRepo.findAll(spec, PageRequest.of(page, size));
    return patientPage.map(PatientResDTO::fromEntity);
  }

  @Transactional(readOnly = true)
  public List<Patient> getPatientsAtThisPeriod(LocalDateTime start, LocalDateTime end, Long clinicId) {
    return patientRepo.findByCreatedAtBetweenAndClinicId(start, end, clinicId);
  }
}