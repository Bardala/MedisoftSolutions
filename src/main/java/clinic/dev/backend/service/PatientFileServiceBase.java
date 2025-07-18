package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.patientFile.PatientFileReq;
import clinic.dev.backend.dto.patientFile.PatientFileRes;

public interface PatientFileServiceBase {
  void uploadPatientFile(PatientFileReq requestDto);

  List<PatientFileRes> downloadFilsByPatientId(Long patientId);

  void deleteFile(Long fileId);
}
