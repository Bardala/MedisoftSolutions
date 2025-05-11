package clinic.dev.backend.service.impl;

import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.ClinicRepo;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.util.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicineService {

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private ClinicRepo clinicRepo;

  private Clinic getClinic() {
    Long clinicId = authContext.getClinicId();
    return clinicRepo.findById(clinicId).orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));
  }

  @Transactional
  public Medicine create(Medicine medicine) {
    Long clinicId = authContext.getClinicId();
    medicine.setClinic(getClinic());

    // Check if medicine with same name already exists in this clinic
    if (medicineRepo.existsByMedicineNameAndClinicId(medicine.getMedicineName(), clinicId)) {
      throw new IllegalArgumentException("Medicine with this name already exists in your clinic");
    }

    return medicineRepo.save(medicine);
  }

  @Transactional
  public Medicine update(Medicine updatedMedicine) {
    Long clinicId = authContext.getClinicId();

    // Verify the medicine belongs to this clinic
    Medicine existing = medicineRepo.findByIdAndClinicId(updatedMedicine.getId(), clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found in your clinic"));

    // Ensure clinic ID can't be changed
    updatedMedicine.setClinic(getClinic());

    // If name changed, check for duplicates
    if (!existing.getMedicineName().equals(updatedMedicine.getMedicineName()) &&
        medicineRepo.existsByMedicineNameAndClinicId(updatedMedicine.getMedicineName(), clinicId)) {
      throw new IllegalArgumentException("Another medicine with this name already exists in your clinic");
    }

    return medicineRepo.save(updatedMedicine);
  }

  @Transactional
  public void delete(Long id) {
    Long clinicId = authContext.getClinicId();

    // Verify the medicine belongs to this clinic
    if (!medicineRepo.existsByIdAndClinicId(id, clinicId)) {
      throw new UnauthorizedAccessException("Medicine not found in your clinic");
    }

    visitMedicineRepo.deleteByMedicineIdAndClinicId(id, clinicId);
    medicineRepo.deleteByIdAndClinicId(id, clinicId);
  }

  public Medicine getById(Long id) {
    Long clinicId = authContext.getClinicId();
    return medicineRepo.findByIdAndClinicId(id, clinicId)
        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found in your clinic"));
  }

  public List<Medicine> getAll() {
    Long clinicId = authContext.getClinicId();
    return medicineRepo.findAllByClinicId(clinicId);
  }

  // Additional useful methods
  public List<Medicine> searchByName(String name) {
    Long clinicId = authContext.getClinicId();
    return medicineRepo.findByMedicineNameContainingIgnoreCaseAndClinicId(name, clinicId);
  }
}