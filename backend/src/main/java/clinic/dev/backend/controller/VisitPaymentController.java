package clinic.dev.backend.controller;

import clinic.dev.backend.model.VisitPayment;
import clinic.dev.backend.service.impl.VisitPaymentService;
import clinic.dev.backend.util.ApiRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visit-payment")
public class VisitPaymentController {

  @Autowired
  private VisitPaymentService visitPaymentService;

  @PostMapping
  public ResponseEntity<ApiRes<VisitPayment>> createVisitPayment(@RequestBody VisitPayment visitPayment) {
    VisitPayment createdVisitPayment = visitPaymentService.create(visitPayment);
    return ResponseEntity.ok(new ApiRes<>(createdVisitPayment));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<VisitPayment>> updateVisitPayment(@PathVariable Long id,
      @RequestBody VisitPayment visitPayment) {
    VisitPayment updatedVisitPayment = visitPaymentService.update(id, visitPayment);
    return ResponseEntity.ok(new ApiRes<>(updatedVisitPayment));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisitPayment(@PathVariable Long id) {
    visitPaymentService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitPayment>> getVisitPaymentById(@PathVariable Long id) {
    VisitPayment visitPayment = visitPaymentService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visitPayment));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitPayment>>> getAllVisitPayments() {
    List<VisitPayment> visitPayments = visitPaymentService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visitPayments));
  }
}