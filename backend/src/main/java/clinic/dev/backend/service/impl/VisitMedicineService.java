package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitMedicine.VisitMedicineReqDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitMedicine;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.service.VisitMedicineServiceBase;
import clinic.dev.backend.util.AuthContext;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitMedicineService implements VisitMedicineServiceBase {

  @Autowired
  private VisitMedicineRepo visitMedicineRepository;

  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  @Override
  public List<VisitMedicineResDTO> findAll() {
    return visitMedicineRepository
        .findAllByClinicId(getClinicId())
        .stream()
        .map(VisitMedicineResDTO::fromEntity)
        .toList();
  }

  @Override
  public VisitMedicineResDTO findById(Long id) {
    return VisitMedicineResDTO
        .fromEntity(visitMedicineRepository
            .findByIdAndClinicId(id, getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("VisitMedicine not found")));
  }

  @Override // todo: check existence of Visit and Medicine
  @Transactional
  public VisitMedicineResDTO create(VisitMedicineReqDTO req) {
    Long clinicId = getClinicId();
    VisitMedicine vm = req.toEntity(clinicId);
    vm = visitMedicineRepository.save(vm);

    return visitMedicineRepository.findVisitMedicineDtoByIdAndClinicId(vm.getId(), clinicId)
        .orElseThrow(() -> new RuntimeException("VisitMedicine not found after save"));
  }

  @Transactional
  public VisitMedicineResDTO update(Long id, VisitMedicineReqDTO req) {
    Long clinicId = getClinicId();

    VisitMedicine vm = visitMedicineRepository.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("VisitMedicine not found"));

    req.updateEntity(vm, clinicId);
    visitMedicineRepository.save(vm);

    return visitMedicineRepository.findVisitMedicineDtoByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new RuntimeException("Failed to load visit medicine after update"));
  }

  @Override
  public void deleteById(Long id) {
    visitMedicineRepository.deleteByIdAndClinicId(id, getClinicId());
  }

  @Override
  public List<VisitMedicineResDTO> getByVisit(Long visitId) {
    return visitMedicineRepository
        .findByVisitIdAndClinicId(visitId, getClinicId())
        .stream()
        .map(VisitMedicineResDTO::fromEntity)
        .toList();
  }

  @Override
  public List<VisitMedicineResDTO> getByMedicine(Long medicineId) {
    return visitMedicineRepository
        .findByMedicineIdAndClinicId(medicineId, getClinicId())
        .stream()
        .map(VisitMedicineResDTO::fromEntity)
        .toList();

  }

}