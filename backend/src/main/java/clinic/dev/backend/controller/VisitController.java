package clinic.dev.backend.controller;

import clinic.dev.backend.dto.visit.VisitReqDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.service.impl.VisitService;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/visits")
public class VisitController {

  @Autowired
  private VisitService visitService;

  @PostMapping
  @PreAuthorize("@planValidation.canCreateVisit()")
  public ResponseEntity<ApiRes<VisitResDTO>> createVisit(@RequestBody VisitReqDTO visit) {
    VisitResDTO createdVisit = visitService.create(visit);
    return ResponseEntity.ok(new ApiRes<>(createdVisit));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<VisitResDTO>> updateVisit(@PathVariable("id") Long id, @RequestBody VisitReqDTO visit) {
    VisitResDTO updatedVisit = visitService.update(id, visit);
    return ResponseEntity.ok(new ApiRes<>(updatedVisit));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@planValidation.canCreateVisit()")
  public ResponseEntity<Void> deleteVisit(@PathVariable("id") Long id) {
    visitService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitResDTO>> getVisitById(@PathVariable("id") Long id) {
    VisitResDTO visit = visitService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visit));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitResDTO>>> getAllVisits() {
    List<VisitResDTO> visits = visitService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visits));
  }

  @GetMapping("/workday")
  public ResponseEntity<ApiRes<List<VisitResDTO>>> getWorkdayVisits(
      @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    // If no date is provided, use the current date
    if (date == null) {
      date = LocalDate.now();
    }
    List<VisitResDTO> workdayVisits = visitService.getVisitsForDate(date);
    return ResponseEntity.ok(new ApiRes<>(workdayVisits));
  }

  @GetMapping("/batch")
  public ResponseEntity<ApiRes<List<VisitResDTO>>> getVisitsByIds(
      @RequestParam List<Long> ids) {
    List<VisitResDTO> visits = visitService.getVisitsByIds(ids);
    return ResponseEntity.ok(new ApiRes<>(visits));
  }
}
