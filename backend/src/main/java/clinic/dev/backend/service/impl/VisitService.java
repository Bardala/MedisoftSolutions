package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visit.VisitReqDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.service.VisitServiceBase;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.util.WorkdayWindowUtil;
import clinic.dev.backend.util.WorkdayWindowUtil.TimeWindow;
import clinic.dev.backend.validation.PlanValidation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VisitService implements VisitServiceBase {

  @Autowired
  private VisitRepo visitRepo;

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;
  @Autowired
  private VisitPaymentRepo visitPaymentRepo;
  @Autowired
  private AuthContext authContext;
  @Autowired
  private PlanValidation planValidation;

  @Override
  @Transactional
  public VisitResDTO create(VisitReqDTO req) {
    Long clinicId = authContext.getClinicId();

    planValidation.trackVisitIfNeeded();

    Visit visit = req.toEntity(clinicId);
    visit = visitRepo.save(visit);

    return visitRepo.findDtoByIdAndClinicId(visit.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("Visit not found after save"));
  }

  @Override
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

  @Override
  @Transactional
  public void delete(Long id) {
    visitDentalProcedureRepo.deleteByVisitId(id);
    visitPaymentRepo.deleteByVisitId(id);
    visitRepo.deleteById(id);
  }

  @Override
  public VisitResDTO getById(Long id) {
    Long clinicId = authContext.getClinicId();

    VisitResDTO visitResDto = visitRepo.findDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));

    return visitResDto;
  }

  @Override
  public List<VisitResDTO> getAll() {
    Long clinicId = authContext.getClinicId();

    List<Visit> visits = visitRepo.findAllByClinicId(clinicId);

    return visits.stream().map(VisitResDTO::fromEntity).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<VisitResDTO> getVisitsForDate(LocalDate date) {
    Long clinicId = authContext.getClinicId();

    TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(date);

    List<Visit> visits;
    if (authContext.isDoctor()) {
      Long doctorId = authContext.getUserId();
      visits = visitRepo.findByClinicIdAndDoctorIdAndCreatedAtBetween(
          clinicId, doctorId, window.start(), window.end());
    } else {
      visits = visitRepo.findByClinicIdAndCreatedAtBetween(
          clinicId, window.start(), window.end());
    }

    return visits.stream()
        .map(VisitResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  private List<Visit> getVisitsAtThisPeriod(Instant start, Instant end) {
    return visitRepo.findByClinicIdAndCreatedAtBetween(authContext.getClinicId(), start, end);
  }

  @Override
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

  @Override
  @Transactional(readOnly = true)
  public List<VisitResDTO> getAppointmentsByDay(LocalDate date) {
    Long clinicId = authContext.getClinicId();
    TimeWindow window = WorkdayWindowUtil.resolveWorkdayWindow(date);

    if (authContext.isDoctor()) {
      Long doctorId = authContext.getUserId();
      return visitRepo.findByClinicIdAndDoctorIdAndScheduledTimeBetween(
          clinicId, doctorId, window.start(), window.end())
          .stream()
          .map(VisitResDTO::fromEntity)
          .collect(Collectors.toList());
    } else
      return visitRepo.findByClinicIdAndScheduledTimeBetween(clinicId, window.start(), window.end())
          .stream()
          .map(VisitResDTO::fromEntity)
          .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<VisitResDTO> getAppointmentsByWeek(LocalDate startDate) {
    Long clinicId = authContext.getClinicId();
    Instant startOfWeek = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant endOfWeek = startOfWeek.plus(8, ChronoUnit.DAYS);

    if (authContext.isDoctor()) {
      Long doctorId = authContext.getUserId();
      return visitRepo.findByClinicIdAndDoctorIdAndScheduledTimeBetween(
          clinicId, doctorId, startOfWeek, endOfWeek)
          .stream()
          .map(VisitResDTO::fromEntity)
          .collect(Collectors.toList());
    } else
      return visitRepo.findByClinicIdAndScheduledTimeBetween(clinicId, startOfWeek, endOfWeek)
          .stream()
          .map(VisitResDTO::fromEntity)
          .collect(Collectors.toList());
  }
}