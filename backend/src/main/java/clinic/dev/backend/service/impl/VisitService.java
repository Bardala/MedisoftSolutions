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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

  public List<VisitResDTO> getVisitsForDate(LocalDate date) {
    LocalDateTime workdayStart = date.atTime(6, 0); // 6 AM on the given date
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM the next day

    // If the date is today and the current time is before 6 AM, adjust the period
    if (date.isEqual(LocalDate.now()) && LocalDateTime.now().isBefore(workdayStart)) {
      LocalDateTime at12Am = date.atTime(LocalTime.MIN); // 12 AM on the given date
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM on the given date

      List<Visit> visitsFrom0to6Am = getVisitsAtThisPeriod(at12Am, at6Am);

      // Get visits from the previous day (6 AM to 12 AM)
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));
      List<Visit> visitsAfter6AmYesterday = getVisitsAtThisPeriod(after6AmYesterday, at12Am);

      visitsFrom0to6Am.addAll(visitsAfter6AmYesterday);

      return visitsFrom0to6Am.stream().map(VisitResDTO::fromEntity).toList();
    }

    return getVisitsAtThisPeriod(workdayStart, workdayEnd).stream().map(VisitResDTO::fromEntity).toList();
  }

  private List<Visit> getVisitsAtThisPeriod(LocalDateTime start, LocalDateTime end) {
    return visitRepo.findAll().stream()
        .filter(
            visit -> !visit.getCreatedAt().isBefore(start) && visit.getCreatedAt().isBefore(end))
        .collect(Collectors.toList());
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
  LocalDateTime createdAt;
  String doctorNotes;
  String dentalProcedureArabicName;
}