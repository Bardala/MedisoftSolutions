package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.procedure.ProcedureReqDTO;
import clinic.dev.backend.dto.procedure.ProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Procedure;
import clinic.dev.backend.repository.DentalProcedureRepo;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.util.AuthContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProcedureService {

  @Autowired
  private DentalProcedureRepo procedureRepo;

  @Autowired
  private VisitDentalProcedureRepo visitProcedureRepo;

  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  public ProcedureResDTO create(ProcedureReqDTO req) {
    authContext.validateAdminOrDoctorAccess();

    Procedure procedure = req.toEntity(getClinicId());

    return ProcedureResDTO.fromEntity(procedureRepo.save(procedure));
  }

  // todo: test this annotation
  public ProcedureResDTO update(Long id, ProcedureReqDTO req) {
    authContext.validateAdminOrDoctorAccess();

    Procedure procedure = procedureRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    req.updateEntity(procedure, getClinicId());

    return ProcedureResDTO.fromEntity(procedureRepo.save(procedure));
  }

  @Transactional
  public void delete(Long id) {
    authContext.validateAdminOrDoctorAccess();

    visitProcedureRepo.deleteByDentalProcedureIdAndClinicId(id, getClinicId());

    procedureRepo.deleteByIdAndClinicId(id, getClinicId());
  }

  public ProcedureResDTO getById(Long id) {
    Procedure procedure = procedureRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    return ProcedureResDTO.fromEntity(procedure);
  }

  public List<ProcedureResDTO> getAll() {
    return procedureRepo.findAllByClinicId(getClinicId()).stream().map(ProcedureResDTO::fromEntity).toList();
  }

  public void deleteAll() {
    procedureRepo.deleteAll();
  }
}
