package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService implements BaseService<Medicine> {

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @Override
  public Medicine create(Medicine medicine) {
    return medicineRepo.save(medicine);
  }

  @Override
  public Medicine update(Long id, Medicine updatedMedicine) {
    Medicine existingMedicine = getById(id);
    existingMedicine.setMedicineName(updatedMedicine.getMedicineName());
    existingMedicine.setDosage(updatedMedicine.getDosage());
    existingMedicine.setDuration(updatedMedicine.getDuration());
    existingMedicine.setFrequency(updatedMedicine.getFrequency());
    existingMedicine.setInstructions(updatedMedicine.getInstructions());

    return medicineRepo.save(existingMedicine);
  }

  @Override
  public void delete(Long id) {
    visitMedicineRepo.deleteByMedicineId(id);
    medicineRepo.deleteById(id);
  }

  @Override
  public Medicine getById(Long id) {
    return medicineRepo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
  }

  @Override
  public List<Medicine> getAll() {
    return medicineRepo.findAll();
  }
}
