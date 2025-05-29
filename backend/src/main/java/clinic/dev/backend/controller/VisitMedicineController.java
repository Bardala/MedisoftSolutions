package clinic.dev.backend.controller;

import clinic.dev.backend.dto.visitMedicine.VisitMedicineReqDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import clinic.dev.backend.service.impl.VisitMedicineService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visit-medicines")
public class VisitMedicineController {

  @Autowired
  private VisitMedicineService visitMedicineService;

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitMedicineResDTO>>> getAllVisitMedicines() {
    List<VisitMedicineResDTO> visitMedicines = visitMedicineService.findAll();
    return new ResponseEntity<>(new ApiRes<>(visitMedicines), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitMedicineResDTO>> getVisitMedicineById(@PathVariable("id") Long id) {
    VisitMedicineResDTO vm = visitMedicineService.findById(id);
    return ResponseEntity.ok(new ApiRes<>(vm));
  }

  @PostMapping
  public ResponseEntity<ApiRes<VisitMedicineResDTO>> createVisitMedicine(
      @Valid @RequestBody VisitMedicineReqDTO visitMedicine) {
    VisitMedicineResDTO savedVisitMedicine = visitMedicineService.create(visitMedicine);
    return new ResponseEntity<>(new ApiRes<>(savedVisitMedicine), HttpStatus.CREATED);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deleteVisitMedicine(@PathVariable("id") Long id) {
    visitMedicineService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/visit/{visitId}")
  public ResponseEntity<ApiRes<List<VisitMedicineResDTO>>> getByVisit(@PathVariable("visitId") Long visitId) {
    List<VisitMedicineResDTO> visitMedicines = visitMedicineService.getByVisit(visitId);
    return ResponseEntity.ok(new ApiRes<>(visitMedicines));
  }

  @GetMapping("/medicine/{medicineId}")
  public ResponseEntity<ApiRes<List<VisitMedicineResDTO>>> getByMedicine(@PathVariable("medicineId") Long medicineId) {
    List<VisitMedicineResDTO> visitMedicines = visitMedicineService.getByMedicine(medicineId);
    return ResponseEntity.ok(new ApiRes<>(visitMedicines));
  }
}