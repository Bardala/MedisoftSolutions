package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.PatientFile;

@Repository
public interface PatientFileRepo extends JpaRepository<PatientFile, Long> {
  List<PatientFile> findByPatientId(Long patientId);

  void deleteByPatientId(Long patientId);

  List<PatientFile> findByClinicId(Long clinicId);

  @Query("SELECT SUM(p.fileSize) FROM PatientFile p WHERE p.clinic.id = :clinicId")
  Long sumFileSizeBytesByClinicId(@Param("clinicId") Long clinicId);
}
