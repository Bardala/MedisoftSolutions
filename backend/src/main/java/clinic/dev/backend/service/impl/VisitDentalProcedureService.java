package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitDentalProcedureService {

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  public VisitDentalProcedure create(VisitDentalProcedure visitDentalProcedure) {
    return visitDentalProcedureRepo.save(visitDentalProcedure);
  }

  public VisitDentalProcedure update(Long id, VisitDentalProcedure updatedVisitDentalProcedure) {
    VisitDentalProcedure existingVisitDentalProcedure = getById(id);
    existingVisitDentalProcedure.setVisit(updatedVisitDentalProcedure.getVisit());
    existingVisitDentalProcedure.setDentalProcedure(updatedVisitDentalProcedure.getDentalProcedure());
    return visitDentalProcedureRepo.save(existingVisitDentalProcedure);
  }

  public void delete(Long id) {
    visitDentalProcedureRepo.deleteById(id);
  }

  public VisitDentalProcedure getById(Long id) {
    return visitDentalProcedureRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("VisitDentalProcedure not found"));
  }

  public List<VisitDentalProcedure> getAll() {
    return visitDentalProcedureRepo.findAll();
  }

  public List<VisitDentalProcedure> todayDentalProcedure() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // Filter the payments based on the createdAt timestamp being within the workday
    return visitDentalProcedureRepo.findAll().stream()
        .filter(
            vdp -> !vdp.getVisit().getCreatedAt().isBefore(workdayStart)
                && vdp.getVisit().getCreatedAt().isBefore(workdayEnd))
        .collect(Collectors.toList());
  }
}