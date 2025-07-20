package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.dto.patient.PatientReqDTO;
import clinic.dev.backend.dto.patient.PatientResDTO;
import clinic.dev.backend.dto.patient.statistics.AddressDistributionDTO;
import clinic.dev.backend.dto.patient.statistics.AgeDistributionDTO;
import clinic.dev.backend.dto.patient.statistics.PatientStatisticsDTO;
import clinic.dev.backend.dto.patient.statistics.RegistrationTrendDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.exceptions.ClinicLimitExceededException;
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
import java.time.Clock;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;

  @Transactional
  public PatientResDTO create(PatientReqDTO request) {
    Long clinicId = authContext.getClinicId();

    if (clinicLimitsRepo.isPatientLimitReached(clinicId)) {
      throw new ClinicLimitExceededException(
          ("Cannot create patient. Clinic has reached maximum patient capacity"));
    }

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
    Instant now = Instant.now();
    ZonedDateTime zonedNow = now.atZone(ZoneId.systemDefault());

    // Get workday start (6 AM today in local time)
    ZonedDateTime workdayStartZoned = zonedNow.with(LocalTime.of(6, 0));
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    if (now.isBefore(workdayStart)) {
      // Current time is between midnight and 6 AM
      ZonedDateTime midnightZoned = zonedNow.with(LocalTime.MIN);
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Get patients from midnight to 6 AM today
      List<Patient> patientsMorning = patientRepo.findPatientsBetween(
          midnight, sixAm, clinicId);

      // Get patients from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      List<Patient> patientsYesterday = patientRepo.findPatientsBetween(
          yesterdaySixAm, midnight, clinicId);

      // Combine and convert to DTOs
      return Stream.concat(
          patientsMorning.stream(),
          patientsYesterday.stream())
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList());
    }

    // Normal case - current time is after 6 AM
    return patientRepo.findPatientsBetween(workdayStart, workdayEnd, clinicId)
        .stream()
        .map(PatientResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<PatientResDTO> getDailyNewPatientsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();
    Instant now = Instant.now();

    // Convert date to workday start (6 AM in local time)
    ZonedDateTime workdayStartZoned = date.atTime(6, 0).atZone(ZoneId.systemDefault());
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    ZonedDateTime nowZoned = now.atZone(ZoneId.systemDefault());
    if (date.equals(nowZoned.toLocalDate()) && now.isBefore(workdayStart)) {
      // For today before 6 AM
      ZonedDateTime midnightZoned = date.atStartOfDay(ZoneId.systemDefault());
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Get patients from midnight to 6 AM today
      List<Patient> patientsMorning = patientRepo.findPatientsBetween(
          midnight, sixAm, clinicId);

      // Get patients from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      List<Patient> patientsYesterday = patientRepo.findPatientsBetween(
          yesterdaySixAm, midnight, clinicId);

      // Combine and convert to DTOs
      return Stream.concat(
          patientsMorning.stream(),
          patientsYesterday.stream())
          .map(PatientResDTO::fromEntity)
          .collect(Collectors.toList());
    }

    // Normal case
    return patientRepo.findPatientsBetween(workdayStart, workdayEnd, clinicId)
        .stream()
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
  public List<Patient> getPatientsAtThisPeriod(Instant start, Instant end, Long clinicId) {
    return patientRepo.findPatientsBetween(start, end, clinicId);
  }

  public List<PatientResDTO> getPatientsByIds(List<Long> ids) {
    // Validate input
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Patient IDs cannot be empty");
    }

    // Fetch patients in a single query
    List<Patient> patients = patientRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    // Handle missing patients
    if (patients.size() != ids.size()) {
      Set<Long> foundIds = patients.stream()
          .map(Patient::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some patients not found or not accessible: " + missingIds);
    }

    return patients.stream()
        .map(PatientResDTO::fromEntity)
        .collect(Collectors.toList());

  }

  public PatientStatisticsDTO getPatientStatistics() {
    Long clinicId = authContext.getClinicId();

    List<AgeDistributionDTO> ageDistribution = getAgeDistribution(clinicId);
    List<AddressDistributionDTO> addressDistribution = getAddressDistribution(clinicId);
    List<RegistrationTrendDTO> registrationTrend = getRegistrationTrend(clinicId);

    return new PatientStatisticsDTO(
        ageDistribution,
        addressDistribution,
        registrationTrend);
  }

  private List<AgeDistributionDTO> getAgeDistribution(Long clinicId) {
    List<Object[]> results = patientRepo.countPatientsByAgeGroups(clinicId);

    return results.stream()
        .map(result -> new AgeDistributionDTO(
            (String) result[0], // phase name
            getEmojiForPhase((String) result[0]), // emoji
            getColorForPhase((String) result[0]), // color
            ((Number) result[1]).longValue() // count
        ))
        .toList();
  }

  private List<AddressDistributionDTO> getAddressDistribution(Long clinicId) {
    List<Object[]> results = patientRepo.countPatientsByAddress(clinicId);

    return results.stream()
        .map(result -> new AddressDistributionDTO(
            result[0] != null ? result[0].toString() : "Unknown",
            ((Number) result[1]).longValue()))
        .toList();
  }

  private List<RegistrationTrendDTO> getRegistrationTrend(Long clinicId) {
    int currentYear = LocalDate.now().getYear();
    List<Object[]> results = patientRepo.countPatientsByMonth(clinicId, currentYear);

    return results.stream()
        .map(result -> new RegistrationTrendDTO(
            String.format("%d-%02d", result[0], result[1]),
            ((Number) result[2]).longValue()))
        .toList();
  }

  private String getEmojiForPhase(String phase) {
    return switch (phase.toLowerCase()) {
      case "child" -> "👶";
      case "teen" -> "🧒";
      case "adult" -> "🧑";
      case "middle" -> "🧔";
      case "senior" -> "🧓";
      default -> "";
    };
  }

  private String getColorForPhase(String phase) {
    return switch (phase.toLowerCase()) {
      case "child" -> "#FFD166";
      case "teen" -> "#06D6A0";
      case "adult" -> "#118AB2";
      case "middle" -> "#073B4C";
      case "senior" -> "#EF476F";
      default -> "";
    };
  }

  private Clock clock = Clock.systemDefaultZone();

  // For testing
  public void setClock(Clock clock) {
    this.clock = clock;
  }
}