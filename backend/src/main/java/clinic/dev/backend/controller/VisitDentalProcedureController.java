package clinic.dev.backend.controller;

import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.service.impl.VisitDentalProcedureService;
import clinic.dev.backend.util.ApiRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visit-dental-procedures")
public class VisitDentalProcedureController {

  @Autowired
  private VisitDentalProcedureService visitDentalProcedureService;

  @PostMapping
  public ResponseEntity<ApiRes<VisitDentalProcedure>> createVisitDentalProcedure(
      @RequestBody VisitDentalProcedure visitDentalProcedure) {
    VisitDentalProcedure createdVisitDentalProcedure = visitDentalProcedureService.create(visitDentalProcedure);
    return ResponseEntity.ok(new ApiRes<>(createdVisitDentalProcedure));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<VisitDentalProcedure>> updateVisitDentalProcedure(@PathVariable Long id,
      @RequestBody VisitDentalProcedure visitDentalProcedure) {
    VisitDentalProcedure updatedVisitDentalProcedure = visitDentalProcedureService.update(id, visitDentalProcedure);
    return ResponseEntity.ok(new ApiRes<>(updatedVisitDentalProcedure));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisitDentalProcedure(@PathVariable Long id) {
    visitDentalProcedureService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitDentalProcedure>> getVisitDentalProcedureById(@PathVariable Long id) {
    VisitDentalProcedure visitDentalProcedure = visitDentalProcedureService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visitDentalProcedure));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitDentalProcedure>>> getAllVisitDentalProcedures() {
    List<VisitDentalProcedure> visitDentalProcedures = visitDentalProcedureService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visitDentalProcedures));
  }
}