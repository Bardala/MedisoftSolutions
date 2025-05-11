package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import clinic.dev.backend.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

  List<Payment> findByPatientId(Long id);

  void deleteByPatientId(Long id);

  List<Payment> findByClinicId(Long clinicId);

  List<Payment> findByClinicIdAndPatientId(Long clinicId, Long patientId);

  void deleteByPatientIdAndClinicId(Long id, Long clinicId);

  List<Payment> findByPatientIdAndClinicId(Long id, Long clinicId);

}
