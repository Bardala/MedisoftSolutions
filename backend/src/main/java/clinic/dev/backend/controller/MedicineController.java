package clinic.dev.backend.controller;

import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.service.impl.MedicineService;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/medicines")
public class MedicineController {

  @Autowired
  private MedicineService medicineService;

  @PostMapping
  public ResponseEntity<ApiRes<Medicine>> createMedicine(@RequestBody Medicine medicine) {
    Medicine createdMedicine = medicineService.create(medicine);
    return ResponseEntity.ok(new ApiRes<>(createdMedicine));
  }

  @PutMapping()
  public ResponseEntity<ApiRes<Medicine>> updateMedicine(@RequestBody Medicine medicine) {
    Medicine updatedMedicine = medicineService.update(medicine);
    return ResponseEntity.ok(new ApiRes<>(updatedMedicine));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deleteMedicine(@PathVariable Long id) {
    medicineService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<Medicine>> getMedicineById(@PathVariable Long id) {
    Medicine medicine = medicineService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(medicine));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<Medicine>>> getAllMedicines() {
    List<Medicine> medicines = medicineService.getAll();
    return ResponseEntity.ok(new ApiRes<>(medicines));
  }
}
