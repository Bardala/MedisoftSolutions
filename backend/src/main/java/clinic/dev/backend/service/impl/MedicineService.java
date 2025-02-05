package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.VisitMedicineRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  public Medicine create(Medicine medicine) {
    return medicineRepo.save(medicine);
  }

  public Medicine update(Medicine updatedMedicine) {
    return medicineRepo.save(updatedMedicine);
  }

  public void delete(Long id) {
    visitMedicineRepo.deleteByMedicineId(id);
    medicineRepo.deleteById(id);
  }

  public Medicine getById(Long id) {
    return medicineRepo.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
  }

  public List<Medicine> getAll() {
    return medicineRepo.findAll();
  }
}
