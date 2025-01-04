package clinic.dev.backend.controller;

import clinic.dev.backend.model.DentalProcedure;
import clinic.dev.backend.service.impl.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class DentalProcedureController {

  @Autowired
  private ServiceService serviceService;

  @PostMapping
  public ResponseEntity<DentalProcedure> createService(@RequestBody DentalProcedure service) {
    DentalProcedure createdDentalProcedure = serviceService.create(service);
    return ResponseEntity.ok(createdDentalProcedure);
  }

  @PutMapping("/{id}")
  public ResponseEntity<DentalProcedure> updateDentalProcedure(@PathVariable Long id,
      @RequestBody DentalProcedure service) {
    DentalProcedure updatedDentalProcedure = serviceService.update(id, service);
    return ResponseEntity.ok(updatedDentalProcedure);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDentalProcedure(@PathVariable Long id) {
    serviceService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<DentalProcedure> getDentalProcedureById(@PathVariable Long id) {
    DentalProcedure service = serviceService.getById(id);
    return ResponseEntity.ok(service);
  }

  @GetMapping
  public ResponseEntity<List<DentalProcedure>> getAllDentalProcedures() {
    List<DentalProcedure> services = serviceService.getAll();
    return ResponseEntity.ok(services);
  }
}
