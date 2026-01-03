package clinic.dev.backend.repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.model.VisitPayment;

public interface VisitPaymentRepo extends JpaRepository<VisitPayment, Long> {
  List<VisitPayment> findByVisitId(Long visitId);

  List<VisitPayment> findByVisitPatientId(Long id);

  Collection<VisitPayment> findByVisit(Visit visit);

  void deleteByVisitPatientId(Long patientId);

  void deleteByPaymentId(Long id);

  void deleteByVisitId(Long id);

  void deleteByVisitPatientIdAndClinicId(Long id, Long clinicId);

  List<VisitPayment> findByVisitPatientIdAndClinicId(Long id, Long clinicId);

  void deleteByPaymentIdAndClinicId(Long id, Long clinicId);

  Optional<VisitPayment> findByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<VisitPayment> findAllByClinicId(Long clinicId);

  @Query("""
          SELECT new clinic.dev.backend.dto.visitPayment.VisitPaymentResDTO(
              vp.id,
              v.id,

              p.id,
              p.amount,
              pt.fullName,
              pt.phone,
              u.id,
              u.name,
              p.createdAt,

              c.id
          )
          FROM VisitPayment vp
          JOIN vp.visit v
          JOIN vp.payment p
          JOIN p.patient pt
          JOIN p.recordedBy u
          JOIN vp.clinic c
          WHERE vp.id = :id AND c.id = :clinicId
      """)
  Optional<VisitPaymentResDTO> findVisitPaymentDtoByIdAndClinicId(@Param("id") Long id,
      @Param("clinicId") Long clinicId);

  List<VisitPayment> findByVisitDoctorIdAndClinicIdAndVisitCreatedAtBetween(
      Long doctorId,
      Long clinicId,
      Instant start,
      Instant end);

  @Query("SELECT SUM(p.amount) " +
      "FROM VisitPayment vp " +
      "JOIN vp.payment p " +
      "JOIN vp.visit v " +
      "WHERE v.doctor.id = :doctorId " +
      "AND vp.clinic.id = :clinicId " +
      "AND p.createdAt BETWEEN :start AND :end")
  Double sumPaymentsByDoctorAndClinicAndCreatedAtBetween(
      @Param("doctorId") Long doctorId,
      @Param("clinicId") Long clinicId,
      @Param("start") Instant start,
      @Param("end") Instant end);

  List<VisitPayment> findByVisitDoctorIdAndClinicIdAndPaymentCreatedAtBetween(
      Long doctorId,
      Long clinicId,
      Instant monthStart,
      Instant monthEnd);
}
