package clinic.dev.backend.controller;

import clinic.dev.backend.model.VisitMedicine;
import clinic.dev.backend.service.impl.VisitMedicineService;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/visit-medicines")
public class VisitMedicineController {

  @Autowired
  private VisitMedicineService visitMedicineService;

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitMedicine>>> getAllVisitMedicines() {
    List<VisitMedicine> visitMedicines = visitMedicineService.findAll();
    return new ResponseEntity<>(new ApiRes<>(visitMedicines), HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitMedicine>> getVisitMedicineById(@PathVariable Long id) {
    Optional<VisitMedicine> visitMedicine = visitMedicineService.findById(id);
    return visitMedicine.map(value -> new ResponseEntity<>(new ApiRes<>(value), HttpStatus.OK))
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  public ResponseEntity<ApiRes<VisitMedicine>> createVisitMedicine(@RequestBody VisitMedicine visitMedicine) {
    VisitMedicine savedVisitMedicine = visitMedicineService.save(visitMedicine);
    return new ResponseEntity<>(new ApiRes<>(savedVisitMedicine), HttpStatus.CREATED);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deleteVisitMedicine(@PathVariable Long id) {
    visitMedicineService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping("/visit/{visitId}")
  public ResponseEntity<ApiRes<List<VisitMedicine>>> getByVisit(@PathVariable Long visitId) {
    List<VisitMedicine> visitMedicines = visitMedicineService.getByVisit(visitId);
    return ResponseEntity.ok(new ApiRes<>(visitMedicines));
  }

  @GetMapping("/medicine/{medicineId}")
  public ResponseEntity<ApiRes<List<VisitMedicine>>> getByMedicine(@PathVariable Long medicineId) {
    List<VisitMedicine> visitMedicines = visitMedicineService.getByMedicine(medicineId);
    return ResponseEntity.ok(new ApiRes<>(visitMedicines));
  }
}