package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.payment.PaymentResDTO;
import clinic.dev.backend.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

  List<Payment> findByPatientId(Long id);

  void deleteByPatientId(Long id);

  List<Payment> findByClinicId(Long clinicId);

  List<Payment> findByClinicIdAndPatientId(Long clinicId, Long patientId);

  void deleteByPatientIdAndClinicId(Long id, Long clinicId);

  List<Payment> findByPatientIdAndClinicId(Long id, Long clinicId);

  Optional<Payment> findByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<Payment> findAllByClinicId(Long clinicId);

  List<Payment> findByIdInAndClinicId(List<Long> ids, Long clinicId);

  @Query("""
          SELECT new clinic.dev.backend.dto.payment.PaymentResDTO(
              p.id,
              c.id,
              p.amount,

              pt.id,
              pt.fullName,
              pt.phone,

              u.id,
              u.name,

              p.createdAt
          )
          FROM Payment p
          JOIN p.clinic c
          JOIN p.patient pt
          JOIN p.recordedBy u
          WHERE p.id = :id AND c.id = :clinicId
      """)
  Optional<PaymentResDTO> findPaymentDtoByIdAndClinicId(@Param("id") Long id, @Param("clinicId") Long clinicId);
}
