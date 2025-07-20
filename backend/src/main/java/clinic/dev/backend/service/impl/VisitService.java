package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visit.VisitReqDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.util.AuthContext;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class VisitService {

  @Autowired
  private VisitRepo visitRepo;

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;
  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  @Autowired
  private AuthContext authContext;

  @Transactional
  public VisitResDTO create(VisitReqDTO req) {
    Long clinicId = authContext.getClinicId();

    Visit visit = req.toEntity(clinicId);
    visit = visitRepo.save(visit);

    return visitRepo.findDtoByIdAndClinicId(visit.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("Visit not found after save"));
  }

  @Transactional
  public VisitResDTO update(Long id, VisitReqDTO req) {
    Long clinicId = authContext.getClinicId();

    Visit visit = visitRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

    req.updateEntity(visit, clinicId);
    visitRepo.save(visit);

    return visitRepo.findDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load visit after update"));
  }

  @Transactional
  public void delete(Long id) {
    visitDentalProcedureRepo.deleteByVisitId(id);
    visitPaymentRepo.deleteByVisitId(id);
    visitRepo.deleteById(id);
  }

  public VisitResDTO getById(Long id) {
    Long clinicId = authContext.getClinicId();

    VisitResDTO visitResDto = visitRepo.findDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

    return visitResDto;
  }

  public List<VisitResDTO> getAll() {
    Long clinicId = authContext.getClinicId();

    List<Visit> visits = visitRepo.findAllByClinicId(clinicId);

    return visits.stream().map(VisitResDTO::fromEntity).toList();
  }

  @Transactional(readOnly = true)
  public List<VisitResDTO> getVisitsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();

    // Convert LocalDate to Instant at 6:00 AM in system default timezone
    ZonedDateTime workdayStartZoned = date.atTime(6, 0).atZone(ZoneId.systemDefault());
    Instant workdayStart = workdayStartZoned.toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    ZonedDateTime nowZoned = Instant.now().atZone(ZoneId.systemDefault());
    if (date.equals(nowZoned.toLocalDate()) && Instant.now().isBefore(workdayStart)) {
      // For today before 6 AM
      ZonedDateTime midnightZoned = date.atStartOfDay(ZoneId.systemDefault());
      Instant midnight = midnightZoned.toInstant();
      Instant sixAm = midnight.plus(6, ChronoUnit.HOURS);

      // Get visits from midnight to 6 AM today
      List<Visit> visitsMorning = visitRepo.findByClinicIdAndCreatedAtBetween(
          clinicId, midnight, sixAm);

      // Get visits from 6 AM yesterday to midnight today
      ZonedDateTime yesterdaySixAmZoned = workdayStartZoned.minusDays(1);
      Instant yesterdaySixAm = yesterdaySixAmZoned.toInstant();

      List<Visit> visitsYesterday = visitRepo.findByClinicIdAndCreatedAtBetween(
          clinicId, yesterdaySixAm, midnight);

      // Combine and convert to DTOs
      return Stream.concat(
          visitsMorning.stream(),
          visitsYesterday.stream())
          .map(VisitResDTO::fromEntity)
          .collect(Collectors.toList());
    }

    // Normal case
    return visitRepo.findByClinicIdAndCreatedAtBetween(clinicId, workdayStart, workdayEnd)
        .stream()
        .map(VisitResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  private List<Visit> getVisitsAtThisPeriod(Instant start, Instant end) {
    return visitRepo.findByClinicIdAndCreatedAtBetween(authContext.getClinicId(), start, end);
  }

  public List<VisitResDTO> getVisitsByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Visit IDs cannot be empty");
    }

    List<Visit> visits = visitRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (visits.size() != ids.size()) {
      Set<Long> foundIds = visits.stream()
          .map(Visit::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some Visit not found or not accessible: " + missingIds);
    }

    return visits.stream()
        .map(VisitResDTO::fromEntity)
        .collect(Collectors.toList());

  }
}

// todo: make getTodayVisits return this type
@Data
class TodayVisits {
  String patientName;
  String phone;
  Double amountPaid;
  String recordedBy;
  Instant createdAt;
  String doctorNotes;
  String dentalProcedureArabicName;
}