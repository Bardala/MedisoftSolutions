package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.service.BaseService;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitService implements BaseService<Visit> {

  @Autowired
  private VisitRepo visitRepo;

  @Override
  public Visit create(Visit visit) {
    return visitRepo.save(visit);
  }

  @Override
  public Visit update(Long id, Visit updatedVisit) {
    Visit existingVisit = getById(id);
    existingVisit.setAssistant(updatedVisit.getAssistant());
    existingVisit.setDoctor(updatedVisit.getDoctor());
    existingVisit.setDoctorNotes(updatedVisit.getDoctorNotes());
    existingVisit.setDuration(updatedVisit.getDuration());
    existingVisit.setPatient(updatedVisit.getPatient());
    existingVisit.setWait(updatedVisit.getWait());

    return visitRepo.save(existingVisit);
  }

  @Override
  public void delete(Long id) {
    visitRepo.deleteById(id);
  }

  @Override
  public Visit getById(Long id) {
    return visitRepo.findById(id).orElseThrow(() -> new RuntimeException("Visit not found"));
  }

  @Override
  public List<Visit> getAll() {
    return visitRepo.findAll();
  }

  public List<Visit> getTodayVisits() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // Filter the payments based on the createdAt timestamp being within the workday
    return visitRepo.findAll().stream()
        .filter(
            visit -> !visit.getCreatedAt().isBefore(workdayStart) && visit.getCreatedAt().isBefore(workdayEnd))
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