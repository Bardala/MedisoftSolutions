package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.medicine.MedicineReqDTO;
import clinic.dev.backend.dto.medicine.MedicineResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.util.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MedicineService {

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  @Transactional
  public MedicineResDTO create(MedicineReqDTO req) {
    authContext.validateAdminOrDoctorAccess();

    Medicine medicine = req.toEntity(getClinicId());

    // Check if medicine with same name already exists in this clinic
    if (medicineRepo.existsByMedicineNameAndClinicId(medicine.getMedicineName(), getClinicId())) {
      throw new IllegalArgumentException("Medicine with this name already exists in your clinic");
    }

    return MedicineResDTO.fromEntity(medicineRepo.save(medicine));
  }

  @Transactional
  public MedicineResDTO update(MedicineReqDTO req) {
    authContext.validateAdminOrDoctorAccess();

    Medicine medicine = medicineRepo
        .findByMedicineNameAndClinicId(req.medicineName(), getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Medicine with this name not found"));

    req.updateEntity(medicine);

    // If the method is @Transactional (yours is), you can omit save() because
    // changes are automatically flushed at the end of the transaction:
    return MedicineResDTO.fromEntity(medicine);
  }

  @Transactional
  public void delete(Long id) {
    authContext.validateAdminOrDoctorAccess();

    // Verify the medicine belongs to this clinic
    if (!medicineRepo.existsByIdAndClinicId(id, getClinicId())) {
      throw new UnauthorizedAccessException("Medicine not found in your clinic");
    }

    visitMedicineRepo.deleteByMedicineIdAndClinicId(id, getClinicId());
    medicineRepo.deleteByIdAndClinicId(id, getClinicId());
  }

  public MedicineResDTO getById(Long id) {
    Medicine medicine = medicineRepo
        .findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found in your clinic"));

    return MedicineResDTO.fromEntity(medicine);
  }

  public List<MedicineResDTO> getAll() {
    return medicineRepo.findAllByClinicId(getClinicId()).stream().map(MedicineResDTO::fromEntity).toList();
  }

  // Additional useful methods
  public List<Medicine> searchByName(String name) {
    return medicineRepo.findByMedicineNameContainingIgnoreCaseAndClinicId(name, getClinicId());
  }

  public List<MedicineResDTO> getMedicinesByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Medicine IDs cannot be empty");
    }

    List<Medicine> medicines = medicineRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (medicines.size() != ids.size()) {
      Set<Long> foundIds = medicines.stream()
          .map(Medicine::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some Medicine not found or not accessible: " + missingIds);
    }

    return medicines.stream()
        .map(MedicineResDTO::fromEntity)
        .collect(Collectors.toList());

  }
}