package clinic.dev.backend.controller;

import clinic.dev.backend.dto.visitPayment.VisitPaymentReqDTO;
import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.service.impl.VisitPaymentService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;

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
  public ResponseEntity<ApiRes<VisitPaymentResDTO>> createVisitPayment(@Valid @RequestBody VisitPaymentReqDTO req) {
    VisitPaymentResDTO createdVisitPayment = visitPaymentService.create(req);
    return ResponseEntity.ok(new ApiRes<>(createdVisitPayment));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<VisitPaymentResDTO>> updateVisitPayment(@PathVariable("id") Long id,
      @Valid @RequestBody VisitPaymentReqDTO visitPayment) {
    VisitPaymentResDTO updatedVisitPayment = visitPaymentService.update(id, visitPayment);
    return ResponseEntity.ok(new ApiRes<>(updatedVisitPayment));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteVisitPayment(@PathVariable("id") Long id) {
    visitPaymentService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<VisitPaymentResDTO>> getVisitPaymentById(@PathVariable("id") Long id) {
    VisitPaymentResDTO visitPayment = visitPaymentService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(visitPayment));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<VisitPaymentResDTO>>> getAllVisitPayments() {
    List<VisitPaymentResDTO> visitPayments = visitPaymentService.getAll();
    return ResponseEntity.ok(new ApiRes<>(visitPayments));
  }

  @GetMapping("/patient/{patientId}")
  public ResponseEntity<ApiRes<List<VisitPaymentResDTO>>> getVisitPaymentByPatientId(
      @PathVariable("patientId") Long patientId) {
    return ResponseEntity.ok(new ApiRes<>(visitPaymentService.getByPatientId(patientId)));
  }
}