package clinic.dev.backend.controller;

import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.service.impl.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

  @Autowired
  private MedicineService medicineService;

  @PostMapping
  public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
    Medicine createdMedicine = medicineService.create(medicine);
    return ResponseEntity.ok(createdMedicine);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
    Medicine updatedMedicine = medicineService.update(id, medicine);
    return ResponseEntity.ok(updatedMedicine);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
    medicineService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
    Medicine medicine = medicineService.getById(id);
    return ResponseEntity.ok(medicine);
  }

  @GetMapping
  public ResponseEntity<List<Medicine>> getAllMedicines() {
    List<Medicine> medicines = medicineService.getAll();
    return ResponseEntity.ok(medicines);
  }
}
