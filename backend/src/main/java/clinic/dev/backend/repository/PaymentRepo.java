package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

  List<Payment> findByPatientId(Long id);

  void deleteByPatientId(Long id);
}
