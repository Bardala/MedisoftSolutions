package clinic.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.model.ClinicUsage;

public interface ClinicUsageRepo extends JpaRepository<ClinicUsage, Long> {
  @Modifying
  @Query("UPDATE ClinicUsage u SET u.visitCount = u.visitCount + 1 WHERE u.clinic.id = :clinicId")
  void incrementVisitCount(@Param("clinicId") Long clinicId);

  @Modifying
  @Query("UPDATE ClinicUsage u SET u.patientCount = u.patientCount + 1 WHERE u.clinic.id = :clinicId")
  void incrementPatientCount(@Param("clinicId") Long clinicId);

  ClinicUsage findByClinicId(Long clinicId);

  void deleteByClinicId(Long clinicId);
}
