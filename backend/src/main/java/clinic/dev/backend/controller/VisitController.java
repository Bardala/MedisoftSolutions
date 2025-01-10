package clinic.dev.backend.controller;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.service.impl.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visits")
public class VisitController {

  @Autowired
  private VisitService visitService;

  @PostMapping
  public ResponseEntity<Visit> createVisit(@RequestBody Visit visit) {
    Visit createdVisit = visitService.create(visit);
    return ResponseEntity.ok(createdVisit);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Visit> updateVisit(@PathVariable Long id, @RequestBody Visit visit) {
    Visit updatedVisit = visitService.update(id, visit);
    return ResponseEntity.ok(updatedVisit);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
    visitService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Visit> getVisitById(@PathVariable Long id) {
    Visit visit = visitService.getById(id);
    return ResponseEntity.ok(visit);
  }

  @GetMapping
  public ResponseEntity<List<Visit>> getAllVisits() {
    List<Visit> visits = visitService.getAll();
    return ResponseEntity.ok(visits);
  }
}
