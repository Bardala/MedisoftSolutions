package clinic.dev.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import clinic.dev.backend.model.PatientFile;

@Repository
public interface PatientFileRepo extends JpaRepository<PatientFile, Long> {
  List<PatientFile> findByPatientId(Long patientId);

  void deleteByPatientId(Long patientId);
}
