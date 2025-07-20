package clinic.dev.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import clinic.dev.backend.dto.patientFile.PatientFileReq;
import clinic.dev.backend.dto.patientFile.PatientFileRes;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.PatientFile;
import clinic.dev.backend.repository.PatientFileRepo;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.util.AuthContext;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientFileService {

  @Autowired
  private PatientFileRepo patientFileRepo;
  @Autowired
  private PatientRepo patientRepo;
  @Autowired
  private StorageService storageService;
  @Autowired
  private AuthContext authContext;

  public void uploadPatientFile(PatientFileReq patientFileReq, MultipartFile file) {
    PatientFile patientFile = new PatientFile();
    Long clinicId = authContext.getClinicId();

    patientFile.setFileType(patientFileReq.getFileType());
    patientFile.setDescription(patientFileReq.getDescription());
    Optional<Patient> patient = patientRepo.findById(patientFileReq.getPatientId());
    if (!patient.isPresent())
      throw new ResourceNotFoundException("Patient Not Found By id " + patientFileReq.getPatientId());

    patientFile.setPatient(patient.get());
    patientFile.setClinic(patient.get().getClinic()); // Assuming Patient has a clinic reference

    String subFolder = patientFileReq.getFileType();
    String finalDir = patientFileReq.getPatientId().toString();

    String filePath = storageService.storeFile(file, subFolder, finalDir, clinicId);
    patientFile.setFilePath(filePath);

    patientFileRepo.save(patientFile);
  }

  public List<PatientFileRes> getPatientFiles(Long patientId) {
    List<PatientFile> files = patientFileRepo.findByPatientId(patientId);
    return files.stream()
        .map(file -> new PatientFileRes(file.getId(), file.getFileType(), file.getDescription(), file.getFilePath()))
        .collect(Collectors.toList());
  }

  public void deletePatientFiles(Long patientId) {
    List<PatientFile> files = patientFileRepo.findByPatientId(patientId);
    files.forEach(file -> storageService.deleteFile(file.getFilePath()));
    patientFileRepo.deleteAll(files);
  }

  public void deletePatientFile(Long fileId) {
    PatientFile file = patientFileRepo.findById(fileId)
        .orElseThrow(() -> new EntityNotFoundException("File not found."));
    storageService.deleteFile(file.getFilePath());
    patientFileRepo.delete(file);
  }

  public void updatePatientFile(Long fileId, PatientFileReq patientFileReq) {
    PatientFile file = patientFileRepo.findById(fileId)
        .orElseThrow(() -> new EntityNotFoundException("File not found."));
    file.setFileType(patientFileReq.getFileType());
    file.setDescription(patientFileReq.getDescription());
    patientFileRepo.save(file);
  }
}