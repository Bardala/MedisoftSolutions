package clinic.dev.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import clinic.dev.backend.dto.patientFile.PatientFileReq;
import clinic.dev.backend.dto.patientFile.PatientFileRes;
import clinic.dev.backend.exceptions.*;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.PatientFile;
import clinic.dev.backend.repository.PatientFileRepo;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.service.FileStorageService;
import clinic.dev.backend.util.AuthContext;
import clinic.dev.backend.validation.PlanValidation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientFileService {

  @Autowired
  private PatientFileRepo patientFileRepo;
  @Autowired
  private PatientRepo patientRepo;
  @Autowired
  private FileStorageService fileStorageService;

  @Autowired
  private AuthContext authContext;
  @Autowired
  private PlanValidation planValidation;

  @Value("${spring.servlet.multipart.max-file-size:5MB}")
  private String maxFileSize;

  public void uploadPatientFile(PatientFileReq patientFileReq, MultipartFile file) {
    validateFileSize(file);

    PatientFile patientFile = new PatientFile();
    Long clinicId = authContext.getClinicId();

    Optional<Patient> patient = patientRepo.findById(patientFileReq.getPatientId());
    if (!patient.isPresent()) {
      throw new ResourceNotFoundException("Patient Not Found By id " + patientFileReq.getPatientId());
    }

    // Create folder path: clinicId/patientId/fileType
    String folderPath = String.format("%s/%s/%s",
        clinicId,
        patientFileReq.getPatientId(),
        patientFileReq.getFileType());

    String fileUrl = fileStorageService.storeFile(file, folderPath);

    patientFile.setFileType(patientFileReq.getFileType());
    patientFile.setDescription(patientFileReq.getDescription());
    patientFile.setPatient(patient.get());
    patientFile.setClinic(patient.get().getClinic());
    patientFile.setFilePath(fileUrl);
    patientFile.setFileSize(file.getSize());

    patientFileRepo.save(patientFile);
  }

  private void validateFileSize(MultipartFile file) {
    planValidation.canUploadFile(file.getSize());
    long maxSizeBytes = parseSize(maxFileSize);
    if (file.getSize() > maxSizeBytes) {
      throw new FileStorageException("File size exceeds maximum allowed size of " + maxFileSize);
    }
  }

  private long parseSize(String size) {
    size = size.toUpperCase();
    if (size.endsWith("KB")) {
      return Long.parseLong(size.substring(0, size.length() - 2)) * 1024;
    } else if (size.endsWith("MB")) {
      return Long.parseLong(size.substring(0, size.length() - 2)) * 1024 * 1024;
    } else if (size.endsWith("GB")) {
      return Long.parseLong(size.substring(0, size.length() - 2)) * 1024 * 1024 * 1024;
    }
    return Long.parseLong(size);
  }

  public List<PatientFileRes> getPatientFiles(Long patientId) {
    List<PatientFile> files = patientFileRepo.findByPatientId(patientId);
    return files.stream()
        .map(this::convertToDto)
        .collect(Collectors.toList());
  }

  private PatientFileRes convertToDto(PatientFile file) {
    return new PatientFileRes(
        file.getId(),
        file.getFileType(),
        file.getDescription(),
        file.getFilePath());
  }

  public void deletePatientFiles(Long patientId) {
    List<PatientFile> files = patientFileRepo.findByPatientId(patientId);
    files.forEach(file -> {
      fileStorageService.deleteFile(file.getFilePath());
      patientFileRepo.delete(file);
    });
  }

  public void deletePatientFile(Long fileId) {
    PatientFile file = patientFileRepo.findById(fileId)
        .orElseThrow(() -> new ResourceNotFoundException("File not found."));
    fileStorageService.deleteFile(file.getFilePath());
    patientFileRepo.delete(file);
  }

  public void updatePatientFile(Long fileId, PatientFileReq patientFileReq) {
    PatientFile file = patientFileRepo.findById(fileId)
        .orElseThrow(() -> new ResourceNotFoundException("File not found."));
    file.setFileType(patientFileReq.getFileType());
    file.setDescription(patientFileReq.getDescription());
    patientFileRepo.save(file);
  }

  public long getTotalPatientFilesStorageForClinic(Long clinicId) {
    if (clinicId.equals(authContext.getClinicId()) || authContext.isSuperAdmin()) {
      Long id = clinicId == null ? authContext.getClinicId() : clinicId;
      Long totalBytes = patientFileRepo.sumFileSizeBytesByClinicId(id);
      return (totalBytes != null) ? totalBytes / (1024 * 1024) : 0L;
    } else {
      throw new IllegalArgumentException();
    }
  }
}