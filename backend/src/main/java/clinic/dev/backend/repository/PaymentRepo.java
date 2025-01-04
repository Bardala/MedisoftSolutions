package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
}
