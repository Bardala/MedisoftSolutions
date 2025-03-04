package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.repository.VisitRepo;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitService {

  @Autowired
  private VisitRepo visitRepo;

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;
  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  @Transactional
  public Visit create(Visit visit) {
    return visitRepo.save(visit);
  }

  @Transactional
  public Visit update(Visit updatedVisit) {
    Visit existingVisit = getById(updatedVisit.getId());
    existingVisit.setAssistant(updatedVisit.getAssistant());
    existingVisit.setDoctor(updatedVisit.getDoctor());
    existingVisit.setDoctorNotes(updatedVisit.getDoctorNotes());
    existingVisit.setDuration(updatedVisit.getDuration());
    existingVisit.setPatient(updatedVisit.getPatient());
    existingVisit.setWait(updatedVisit.getWait());

    return visitRepo.save(existingVisit);
  }

  @Transactional
  public void delete(Long id) {
    visitDentalProcedureRepo.deleteByVisitId(id);
    visitPaymentRepo.deleteByVisitId(id);
    visitRepo.deleteById(id);
  }

  public Visit getById(Long id) {
    return visitRepo.findById(id).orElseThrow(() -> new RuntimeException("Visit not found"));
  }

  public List<Visit> getAll() {
    return visitRepo.findAll();
  }

  public List<Visit> getTodayVisits() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.with(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // if the current time is after 12 AM and before 6 AM
    if (referenceDate.isBefore(workdayStart)) {
      LocalDateTime at12Am = referenceDate.with(LocalTime.MIN); // 12 AM today
      LocalDateTime at6Am = at12Am.plusHours(6); // 6 AM today

      List<Visit> visitsFrom0to6Am = getVisitsAtThisPeriod(at12Am, at6Am);

      // Now we have to get the visits from the previous day from 6 AM to 12 AM
      LocalDateTime after6AmYesterday = workdayStart.minusDays(1).with(LocalTime.of(6, 0));

      List<Visit> visitsAfter6AmYesterday = getVisitsAtThisPeriod(after6AmYesterday, at12Am);

      visitsFrom0to6Am.addAll(visitsAfter6AmYesterday);

      return visitsFrom0to6Am;
    }

    return getVisitsAtThisPeriod(workdayStart, workdayEnd);
  }

  public List<Visit> getVisitsForDate(LocalDate date) {
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

      return visitsFrom0to6Am;
    }

    return getVisitsAtThisPeriod(workdayStart, workdayEnd);
  }

  public List<Visit> getVisitsAtThisPeriod(LocalDateTime start, LocalDateTime end) {
    return visitRepo.findAll().stream()
        .filter(
            visit -> !visit.getCreatedAt().isBefore(start) && visit.getCreatedAt().isBefore(end))
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