package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitProcedure.VisitProcedureReqDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.util.AuthContext;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VisitProcedureService {

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  @Autowired
  private AuthContext authContext;

  // todo: check existence of Visit and Procedure
  @Transactional
  public VisitProcedureResDTO create(VisitProcedureReqDTO req) {
    Long clinicId = authContext.getClinicId();
    VisitDentalProcedure vdp = req.toEntity(clinicId);
    vdp = visitDentalProcedureRepo.save(vdp);

    return visitDentalProcedureRepo.findVisitProcedureDtoByIdAndClinicId(vdp.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("VisitProcedure not found after save"));
  }

  @Transactional
  public VisitProcedureResDTO update(Long id, VisitProcedureReqDTO req) {
    Long clinicId = authContext.getClinicId();

    VisitDentalProcedure vdp = visitDentalProcedureRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("VisitProcedure not found"));

    req.updateEntity(vdp, clinicId);
    visitDentalProcedureRepo.save(vdp);

    return visitDentalProcedureRepo.findVisitProcedureDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load visit procedure after update"));
  }

  // ? I think this method do nothing
  // public VisitProcedureResDTO update(Long id) {
  // return
  // VisitProcedureResDTO.fromEntity(visitDentalProcedureRepo.save(getById(id)));
  // }

  @Transactional
  public void delete(Long id) {
    visitDentalProcedureRepo.deleteByIdAndClinicId(id, authContext.getClinicId());
  }

  public VisitProcedureResDTO getById(Long id) {
    return VisitProcedureResDTO
        .fromEntity(visitDentalProcedureRepo
            .findByIdAndClinicId(id, authContext.getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("VisitDentalProcedure not found")));
  }

  public List<VisitProcedureResDTO> getAll() {
    return visitDentalProcedureRepo
        .findAllByClinicId(authContext.getClinicId()).stream()
        .map(VisitProcedureResDTO::fromEntity)
        .toList();
  }

  public List<VisitProcedureResDTO> todayDentalProcedure() {
    LocalDateTime referenceDate = LocalDateTime.now();
    LocalDateTime workdayStart = referenceDate.toLocalDate().atTime(LocalTime.of(6, 0)); // 6 AM today
    LocalDateTime workdayEnd = workdayStart.plusHours(24); // 6 AM next day

    // Filter the payments based on the createdAt timestamp being within the workday
    return visitDentalProcedureRepo.findAllByClinicId(authContext.getClinicId()).stream()
        .filter(
            vdp -> !vdp.getVisit().getCreatedAt().isBefore(workdayStart)
                && vdp.getVisit().getCreatedAt().isBefore(workdayEnd))
        .map(VisitProcedureResDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public List<VisitProcedureResDTO> getByVisitId(Long visitId) {
    return visitDentalProcedureRepo
        .findByVisitIdAndClinicId(visitId, authContext.getClinicId())
        .stream()
        .map(VisitProcedureResDTO::fromEntity)
        .toList();
  }
}