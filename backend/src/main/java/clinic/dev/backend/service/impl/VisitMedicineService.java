package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.visitMedicine.VisitMedicineReqDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.VisitMedicine;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.service.VisitMedicineServiceBase;
import clinic.dev.backend.util.AuthContext;

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
  public VisitMedicineResDTO save(VisitMedicineReqDTO req) {
    VisitMedicine vm = req.toEntity(getClinicId());

    return VisitMedicineResDTO.fromEntity(visitMedicineRepository.save(vm));
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