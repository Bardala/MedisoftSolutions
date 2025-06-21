package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitPayment.VisitPaymentReqDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitPayment;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.validation.EntityValidator;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitPaymentService {

  @Autowired
  private VisitPaymentRepo visitPaymentRepo;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private EntityValidator entityValidator;

  @Transactional
  public VisitPaymentResDTO create(VisitPaymentReqDTO req) {
    Long clinicId = authContext.getClinicId();

    entityValidator.validateVisitPayment(req.visitId(), req.paymentId());

    VisitPayment visitPayment = req.toEntity(req.visitId(), req.paymentId(), clinicId);
    visitPayment = visitPaymentRepo.save(visitPayment);

    return visitPaymentRepo.findVisitPaymentDtoByIdAndClinicId(visitPayment.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("VisitPayment not found after save"));
  }

  @Transactional
  public VisitPaymentResDTO update(Long id, VisitPaymentReqDTO req) {
    Long clinicId = authContext.getClinicId();

    entityValidator.validateVisitPayment(req.visitId(), req.paymentId());

    VisitPayment existingVisitPayment = visitPaymentRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("VisitPayment not found"));

    req.updateEntity(existingVisitPayment, clinicId);
    visitPaymentRepo.save(existingVisitPayment);

    return visitPaymentRepo.findVisitPaymentDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load visit payment after update"));
  }

  @Transactional
  public void delete(Long id) {
    visitPaymentRepo.deleteByIdAndClinicId(id, authContext.getClinicId());
  }

  public VisitPaymentResDTO getById(Long id) {
    return VisitPaymentResDTO
        .fromEntity(visitPaymentRepo
            .findByIdAndClinicId(id, authContext.getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("VisitPayment not found")));
  }

  public List<VisitPaymentResDTO> getByPatientId(Long patientId) {
    return visitPaymentRepo
        .findByVisitPatientIdAndClinicId(patientId, authContext.getClinicId()).stream()
        .map(VisitPaymentResDTO::fromEntity)
        .toList();
  }

  public List<VisitPaymentResDTO> getAll() {
    return visitPaymentRepo
        .findAllByClinicId(authContext.getClinicId())
        .stream()
        .map(VisitPaymentResDTO::fromEntity)
        .toList();
  }
}