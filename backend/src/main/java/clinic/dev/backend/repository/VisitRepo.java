package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.model.Visit;

public interface VisitRepo extends JpaRepository<Visit, Long> {

  List<Visit> findByPatientId(Long id);

  void deleteByPatientId(Long id);

  List<Visit> findByClinicId(Long clinicId);

  List<Visit> findByClinicIdAndPatientId(Long clinicId, Long patientId);

  void deleteByPatientIdAndClinicId(Long id, Long clinicId);

  List<Visit> findByPatientIdAndClinicId(Long id, Long clinicId);

  Optional<Visit> findByIdAndClinicId(Long id, Long clinicId);

  List<Visit> findAllByClinicId(Long clinicId);

  List<Visit> findByIdInAndClinicId(List<Long> ids, Long clinicId);

  @Query("SELECT v FROM Visit v " +
      "JOIN FETCH v.patient " +
      "JOIN FETCH v.doctor " +
      "LEFT JOIN FETCH v.assistant " +
      "WHERE v.id = :id AND v.clinic.id = :clinicId")
  Optional<Visit> findByIdAndClinicIdWithRelations(@Param("id") Long id, @Param("clinicId") Long clinicId);

  @Query("""
          SELECT new clinic.dev.backend.dto.visit.VisitResDTO(
              v.id,

              p.id,
              p.fullName,
              p.phone,

              c.id,

              d.id,
              d.name,

              a.id,
              a.name,

              v.wait,
              v.duration,
              v.doctorNotes,
              v.createdAt
          )
          FROM Visit v
          JOIN v.patient p
          JOIN v.doctor d
          LEFT JOIN v.assistant a
          JOIN v.clinic c
          WHERE v.id = :id AND c.id = :clinicId
      """)
  Optional<VisitResDTO> findDtoByIdAndClinicId(@Param("id") Long id, @Param("clinicId") Long clinicId);

  @Query("SELECT v FROM Visit v " +
      "JOIN FETCH v.patient " +
      "JOIN FETCH v.doctor " +
      "LEFT JOIN FETCH v.assistant " +
      "WHERE v.id = :id")
  Optional<Visit> findByIdWithRelations(@Param("id") Long id);
}
