package clinic.dev.backend.controller;

import clinic.dev.backend.model.Payment;
import clinic.dev.backend.service.impl.PaymentService;
import clinic.dev.backend.util.ApiRes;
import lombok.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

  @PutMapping()
  public ResponseEntity<ApiRes<Payment>> updatePayment(@RequestBody Payment payment) {
    Payment updatedPayment = paymentService.update(payment);
    return ResponseEntity.ok(new ApiRes<>(updatedPayment));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deletePayment(@PathVariable Long id) {
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

  @GetMapping("/workday")
  public ResponseEntity<ApiRes<List<Payment>>> workdayPayments(
      @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    // If no date is provided, use the current date
    if (date == null) {
      date = LocalDate.now();
    }
    List<Payment> workdayPayments = paymentService.getPaymentsForDate(date);
    return ResponseEntity.ok(new ApiRes<>(workdayPayments));
  }

  @GetMapping("/summary")
  public ResponseEntity<ApiRes<WorkdayPaymentSummaryRes>> workdayPaymentsSummary() {
    WorkdayPaymentSummaryRes workdayPaymentsSummary = new WorkdayPaymentSummaryRes();
    workdayPaymentsSummary.setPaymentCalc(paymentService.calculateMoneyCollectedToday());
    workdayPaymentsSummary.setPaymentNum(paymentService.countPaymentsForToday());

    return ResponseEntity.ok(new ApiRes<>(workdayPaymentsSummary));
  }

}

@Data
class WorkdayPaymentSummaryRes {
  long paymentNum;
  double paymentCalc;
}