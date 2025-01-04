package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService implements BaseService<Medicine> {

  @Autowired
  private MedicineRepo medicineRepo;

  @Override
  public Medicine create(Medicine medicine) {
    return medicineRepo.save(medicine);
  }

  @Override
  public Medicine update(Long id, Medicine updatedMedicine) {
    Medicine existingMedicine = getById(id);
    existingMedicine.setName(updatedMedicine.getName());
    existingMedicine.setDescription(updatedMedicine.getDescription());
    return medicineRepo.save(existingMedicine);
  }

  @Override
  public void delete(Long id) {
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
