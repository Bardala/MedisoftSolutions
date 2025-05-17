package clinic.dev.backend.controller;

import clinic.dev.backend.dto.payment.PaymentReqDTO;
import clinic.dev.backend.dto.payment.PaymentResDTO;
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
  public ResponseEntity<ApiRes<PaymentResDTO>> createPayment(@RequestBody PaymentReqDTO payment) {
    PaymentResDTO createdPayment = paymentService.create(payment);
    return ResponseEntity.ok(new ApiRes<>(createdPayment));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiRes<PaymentResDTO>> updatePayment(@PathVariable("id") Long id,
      @RequestBody PaymentReqDTO payment) {
    PaymentResDTO updatedPayment = paymentService.update(id, payment);
    return ResponseEntity.ok(new ApiRes<>(updatedPayment));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiRes<Void>> deletePayment(@PathVariable("id") Long id) {
    paymentService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiRes<PaymentResDTO>> getPaymentById(@PathVariable Long id) {
    PaymentResDTO payment = paymentService.getById(id);
    return ResponseEntity.ok(new ApiRes<>(payment));
  }

  @GetMapping
  public ResponseEntity<ApiRes<List<PaymentResDTO>>> getAllPayments() {
    List<PaymentResDTO> payments = paymentService.getAll();
    return ResponseEntity.ok(new ApiRes<>(payments));
  }

  @GetMapping("/workday")
  public ResponseEntity<ApiRes<List<PaymentResDTO>>> workdayPayments(
      @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    // If no date is provided, use the current date
    if (date == null) {
      date = LocalDate.now();
    }
    List<PaymentResDTO> workdayPayments = paymentService.getPaymentsForDate(date);
    return ResponseEntity.ok(new ApiRes<>(workdayPayments));
  }

  // todo: didn't work well, check it
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