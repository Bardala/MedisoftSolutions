package clinic.dev.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import clinic.dev.backend.dto.patientFile.PatientFileReq;
import clinic.dev.backend.dto.patientFile.PatientFileRes;
import clinic.dev.backend.model.PatientFile;
import clinic.dev.backend.repository.PatientFileRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientFileService {

  @Autowired
  private PatientFileRepo patientFileRepo;
  @Autowired
  private PatientService patientService;
  @Autowired
  private StorageService storageService;

  public void uploadPatientFile(PatientFileReq patientFileReq, MultipartFile file) {
    PatientFile patientFile = new PatientFile();

    patientFile.setFileType(patientFileReq.getFileType());
    patientFile.setDescription(patientFileReq.getDescription());
    patientFile.setPatient(patientService.getById(patientFileReq.getPatientId()));

    String subFolder = patientFileReq.getFileType();
    String finalDir = patientFileReq.getPatientId() + "";

    String filePath = storageService.storeFile(file, subFolder, finalDir);
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
