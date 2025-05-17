package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitPayment.VisitPaymentReqDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitPayment;
import clinic.dev.backend.repository.VisitPaymentRepo;
import clinic.dev.backend.util.AuthContext;
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

  // ! check existence of Visit and Payment
  public VisitPaymentResDTO create(VisitPaymentReqDTO req) {

    return VisitPaymentResDTO
        .fromEntity(visitPaymentRepo.save(req.toEntity(req.visitId(), req.paymentId(), authContext.getClinicId())));
  }

  @Transactional // ! check existence of Visit and Payment
  public VisitPaymentResDTO update(Long id, VisitPaymentReqDTO req) {
    VisitPayment existingVisitPayment = visitPaymentRepo
        .findByIdAndClinicId(id, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("VisitPayment not found"));

    req.updateEntity(existingVisitPayment, authContext.getClinicId());

    return VisitPaymentResDTO.fromEntity(existingVisitPayment);
  }

  public void delete(Long id) {
    visitPaymentRepo.deleteById(id);
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