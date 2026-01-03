package clinic.dev.backend.service;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.dto.patient.PatientRegistryRes;
import clinic.dev.backend.dto.patient.PatientReqDTO;
import clinic.dev.backend.dto.patient.PatientResDTO;
import clinic.dev.backend.dto.patient.statistics.PatientStatisticsDTO;
import clinic.dev.backend.model.Patient;

public interface PatientServiceBase {

  PatientResDTO create(PatientReqDTO request);

  PatientResDTO update(Long id, PatientReqDTO req);

  void delete(Long id);

  // Simplified getter using DTO
  PatientResDTO getClinicPatientById(Long id);

  List<Patient> getAll();

  void deleteAllByClinicId(Long clinicId);

  PatientRegistryRes getPatientRegistry(Long id);

  List<PatientRegistryRes> AllPatientsRegistry();

  List<PatientResDTO> dailyNewPatients();

  List<PatientResDTO> getDailyNewPatientsForDate(LocalDate date);

  Page<PatientResDTO> searchPatients(Map<String, String> searchParams, int page, int size);

  List<Patient> getPatientsAtThisPeriod(Instant start, Instant end, Long clinicId);

  List<PatientResDTO> getPatientsByIds(List<Long> ids);

  PatientStatisticsDTO getPatientStatistics();

  // For testing
  void setClock(Clock clock);

}