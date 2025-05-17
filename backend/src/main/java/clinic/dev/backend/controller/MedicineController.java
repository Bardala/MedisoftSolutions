package clinic.dev.backend.controller;

import clinic.dev.backend.dto.medicine.MedicineReqDTO;
import clinic.dev.backend.dto.medicine.MedicineResDTO;
import clinic.dev.backend.service.impl.MedicineService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

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
  public ResponseEntity<ApiRes<MedicineResDTO>> createMedicine(@RequestBody @Valid MedicineReqDTO medicine) {
    MedicineResDTO createdMedicine = medicineService.create(medicine);
    return ResponseEntity.ok(new ApiRes<>(createdMedicine));
  }

  @PutMapping("{id}")
  public ResponseEntity<ApiRes<MedicineResDTO>> updateMedicine(@PathVariable("id") Long id,
      @Valid @RequestBody MedicineReqDTO medicine) {
    MedicineResDTO updatedMedicine = medicineService.update(id, medicine);
    return ResponseEntity.ok(new ApiRes<>(updatedMedicine));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deleteMedicine(@PathVariable("id") Long id) {
    medicineService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<MedicineResDTO>> getMedicineById(@PathVariable("id") Long id) {
    MedicineResDTO medicine = medicineService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(medicine));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<MedicineResDTO>>> getAllMedicines() {
    List<MedicineResDTO> medicines = medicineService.getAll();
    return ResponseEntity.ok(new ApiRes<>(medicines));
  }
}
