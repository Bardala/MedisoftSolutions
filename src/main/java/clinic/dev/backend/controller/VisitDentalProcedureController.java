package clinic.dev.backend.controller;

import clinic.dev.backend.dto.visitProcedure.VisitProcedureReqDTO;
import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.service.impl.VisitProcedureService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visit-dental-procedures")
public class VisitDentalProcedureController {

  @Autowired
  private VisitProcedureService visitDentalProcedureService;

  @PostMapping
  public ResponseEntity<ApiRes<VisitProcedureResDTO>> createVisitDentalProcedure(
      @Valid @RequestBody VisitProcedureReqDTO visitDentalProcedure) {
    VisitProcedureResDTO createdVisitDentalProcedure = visitDentalProcedureService.create(visitDentalProcedure);
    return ResponseEntity.ok(new ApiRes<>(createdVisitDentalProcedure));
  }

  // @PutMapping("/update/{id}")
  // public ResponseEntity<ApiRes<VisitProcedureResDTO>>
  // updateVisitDentalProcedure(@PathVariable Long id) {
  // VisitProcedureResDTO updatedVisitDentalProcedure =
  // visitDentalProcedureService.update(id);
  // return ResponseEntity.ok(new ApiRes<>(updatedVisitDentalProcedure));
  // }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisitDentalProcedure(@PathVariable("id") Long id) {
    visitDentalProcedureService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitProcedureResDTO>> getVisitDentalProcedureById(@PathVariable("id") Long id) {
    VisitProcedureResDTO visitDentalProcedure = visitDentalProcedureService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visitDentalProcedure));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitProcedureResDTO>>> getAllVisitDentalProcedures() {
    List<VisitProcedureResDTO> visitDentalProcedures = visitDentalProcedureService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visitDentalProcedures));
  }

  @GetMapping("/{id}/visit")
  public ResponseEntity<ApiRes<List<VisitProcedureResDTO>>> getProceduresByVisitId(@PathVariable("id") Long id) {
    List<VisitProcedureResDTO> visitProcedures = visitDentalProcedureService.getByVisitId(id);
    return ResponseEntity.ok(new ApiRes<>(visitProcedures));
  }
}