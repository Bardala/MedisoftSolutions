package clinic.dev.backend.controller;

import clinic.dev.backend.model.Payment;
import clinic.dev.backend.service.impl.PaymentService;
import clinic.dev.backend.util.ApiRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

  @Autowired
  private PaymentService paymentService;

  @PostMapping
  public ResponseEntity<ApiRes<Payment>> createPayment(@RequestBody Payment payment) {
    Payment createdPayment = paymentService.create(payment);
    return ResponseEntity.ok(new ApiRes<>(createdPayment));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<Payment>> updatePayment(@PathVariable Long id, @RequestBody Payment payment) {
    Payment updatedPayment = paymentService.update(id, payment);
    return ResponseEntity.ok(new ApiRes<>(updatedPayment));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
    paymentService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<Payment>> getPaymentById(@PathVariable Long id) {
    Payment payment = paymentService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(payment));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<Payment>>> getAllPayments() {
    List<Payment> payments = paymentService.getAll();
    return ResponseEntity.ok(new ApiRes<>(payments));
  }
}
