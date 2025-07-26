package clinic.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.ClinicLimits;

@Repository
public interface ClinicLimitsRepo extends JpaRepository<ClinicLimits, Long> {

  void deleteByClinicId(Long id);

  Optional<ClinicLimits> findByClinicId(Long clinicId);

  void deleteAllByClinicId(Long id);

  @Query("SELECT CASE WHEN COUNT(p) >= cl.maxPatientRecords THEN true ELSE false END " +
      "FROM ClinicLimits cl LEFT JOIN Patient p ON p.clinic.id = cl.clinic.id " +
      "WHERE cl.clinic.id = :clinicId " +
      "GROUP BY cl.maxPatientRecords")
  boolean isPatientLimitReached(@Param("clinicId") Long clinicId);

  @Query("SELECT cu.visitCount >= cl.maxVisitCount " +
      "FROM ClinicUsage cu " +
      "JOIN ClinicLimits cl ON cu.clinic.id = cl.clinic.id " +
      "WHERE cu.clinic.id = :clinicId")
  boolean isVisitLimitReached(@Param("clinicId") Long clinicId);
}
