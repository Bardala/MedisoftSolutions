package clinic.dev.backend.controller;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.service.impl.VisitService;
import clinic.dev.backend.util.ApiRes;

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
  public ResponseEntity<ApiRes<Visit>> createVisit(@RequestBody Visit visit) {
    Visit createdVisit = visitService.create(visit);
    return ResponseEntity.ok(new ApiRes<>(createdVisit));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<Visit>> updateVisit(@PathVariable Long id, @RequestBody Visit visit) {
    Visit updatedVisit = visitService.update(id, visit);
    return ResponseEntity.ok(new ApiRes<>(updatedVisit));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
    visitService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<Visit>> getVisitById(@PathVariable Long id) {
    Visit visit = visitService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visit));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<Visit>>> getAllVisits() {
    List<Visit> visits = visitService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visits));
  }

  @GetMapping("/workday")
  public ResponseEntity<ApiRes<List<Visit>>> getWorkdayVisits() {
    List<Visit> workdayVisits = visitService.getTodayVisits();
    return ResponseEntity.ok(new ApiRes<>(workdayVisits));
  }
}
