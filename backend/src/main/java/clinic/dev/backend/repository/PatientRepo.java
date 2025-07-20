package clinic.dev.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.model.Patient;

// public interface PatientRepo extends JpaRepository<Patient, Long> {

// }

public interface PatientRepo extends JpaRepository<Patient, Long>, JpaSpecificationExecutor<Patient> {
  boolean existsByFullName(String fullname);

  Optional<Patient> findByFullName(String string);

  List<Patient> findByPhoneContaining(String phone, Pageable pageable);

  List<Patient> findByFullNameContainingIgnoreCase(String name, Pageable pageable);

  List<Patient> findByClinicId(Long clinicId);

  List<Patient> findByClinicIdAndFullNameContainingIgnoreCase(Long clinicId, String name, Pageable pageable);

  List<Patient> findByClinicIdAndPhoneContaining(Long clinicId, String phone, Pageable pageable);

  void deleteAllByClinicId(Long clinicId);

  Optional<Patient> findByIdAndClinicId(Long id, Long clinicId);

  List<Patient> findByCreatedAtBetweenAndClinicId(LocalDateTime start, LocalDateTime end, Long clinicId);

  List<Patient> findAllByClinicId(Long clinicId);

  boolean existsByFullNameAndClinicId(String fullName, Long clinicId);

  boolean existsByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<Patient> findByIdInAndClinicId(List<Long> ids, Long clinicId);

  @Query("""
      SELECT
          CASE
              WHEN p.age BETWEEN 0 AND 12 THEN 'Child'
              WHEN p.age BETWEEN 13 AND 19 THEN 'Teen'
              WHEN p.age BETWEEN 20 AND 39 THEN 'Adult'
              WHEN p.age BETWEEN 40 AND 59 THEN 'Middle'
              WHEN p.age >= 60 THEN 'Senior'
              ELSE 'Unknown'
          END as phase,
          COUNT(p) as count
      FROM Patient p
      WHERE p.clinic.id = :clinicId AND p.age IS NOT NULL
      GROUP BY phase
      ORDER BY count DESC
        """)
  List<Object[]> countPatientsByAgeGroups(@Param("clinicId") Long clinicId);

  @Query("""
      SELECT
          COALESCE(p.address, 'Unknown') as address,
          COUNT(p) as count
      FROM Patient p
      WHERE p.clinic.id = :clinicId
      GROUP BY address
      ORDER BY count DESC
        """)
  List<Object[]> countPatientsByAddress(@Param("clinicId") Long clinicId);

  @Query("""
      SELECT
          YEAR(p.createdAt) as year,
          MONTH(p.createdAt) as month,
          COUNT(p) as count
      FROM Patient p
      WHERE p.clinic.id = :clinicId AND YEAR(p.createdAt) = :year
      GROUP BY YEAR(p.createdAt), MONTH(p.createdAt)
      ORDER BY year, month
        """)
  List<Object[]> countPatientsByMonth(@Param("clinicId") Long clinicId, @Param("year") int year);

}