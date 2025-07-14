package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.procedure.ProcedureReqDTO;
import clinic.dev.backend.dto.procedure.ProcedureResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Procedure;
import clinic.dev.backend.repository.DentalProcedureRepo;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.util.AuthContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    Procedure procedure = req.toEntity(getClinicId());

    return ProcedureResDTO.fromEntity(procedureRepo.save(procedure));
  }

  // todo: test this annotation
  public ProcedureResDTO update(Long id, ProcedureReqDTO req) {
    Procedure procedure = procedureRepo.findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Procedure not found"));

    req.updateEntity(procedure, getClinicId());

    return ProcedureResDTO.fromEntity(procedureRepo.save(procedure));
  }

  @Transactional
  public void delete(Long id) {
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

  public List<ProcedureResDTO> getProceduresByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Procedure IDs cannot be empty");
    }

    List<Procedure> procedures = procedureRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (procedures.size() != ids.size()) {
      Set<Long> foundIds = procedures.stream()
          .map(Procedure::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some Procedure not found or not accessible: " + missingIds);
    }

    return procedures.stream()
        .map(ProcedureResDTO::fromEntity)
        .collect(Collectors.toList());

  }
}
