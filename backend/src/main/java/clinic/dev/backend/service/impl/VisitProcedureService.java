package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitProcedure.VisitProcedureReqDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.validation.EntityValidator;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitProcedureService {

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private EntityValidator entityValidator;

  @Transactional
  public VisitProcedureResDTO create(VisitProcedureReqDTO req) {
    entityValidator.validateVisitProcedure(req.visitId(), req.procedureId());

    Long clinicId = authContext.getClinicId();
    VisitDentalProcedure vdp = req.toEntity(clinicId);
    vdp = visitDentalProcedureRepo.save(vdp);

    return visitDentalProcedureRepo.findVisitProcedureDtoByIdAndClinicId(vdp.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("VisitProcedure not found after save"));
  }

  @Transactional
  public VisitProcedureResDTO update(Long id, VisitProcedureReqDTO req) {
    entityValidator.validateVisitProcedure(req.visitId(), req.procedureId());

    Long clinicId = authContext.getClinicId();

    VisitDentalProcedure vdp = visitDentalProcedureRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("VisitProcedure not found"));

    req.updateEntity(vdp, clinicId);
    visitDentalProcedureRepo.save(vdp);

    return visitDentalProcedureRepo.findVisitProcedureDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load visit procedure after update"));
  }

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

  public List<VisitProcedureResDTO> getByVisitId(Long visitId) {
    return visitDentalProcedureRepo
        .findByVisitIdAndClinicId(visitId, authContext.getClinicId())
        .stream()
        .map(VisitProcedureResDTO::fromEntity)
        .toList();
  }
}