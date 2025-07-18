package clinic.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import clinic.dev.backend.dto.patientFile.PatientFileReq;
import clinic.dev.backend.dto.patientFile.PatientFileRes;
import clinic.dev.backend.service.impl.PatientFileService;
import clinic.dev.backend.util.ApiRes;

@RestController
@RequestMapping("/api/v1/patient-file")
public class PatientFileController {

  @Autowired
  private PatientFileService patientFileService;

  @PostMapping
  public ResponseEntity<ApiRes<HttpStatus>> uploadFile(
      @RequestParam("patientId") Long patientId,
      @RequestParam("fileType") String fileType,
      @RequestParam("description") String description,
      @RequestPart("file") MultipartFile file) {

    PatientFileReq requestDto = new PatientFileReq();
    requestDto.setPatientId(patientId);
    requestDto.setFileType(fileType);
    requestDto.setDescription(description);

    patientFileService.uploadPatientFile(requestDto, file);
    return ResponseEntity.ok(new ApiRes<>(HttpStatus.CREATED));
  }

  @GetMapping("/{patientId}")
  public ResponseEntity<ApiRes<List<PatientFileRes>>> getFiles(@PathVariable Long patientId) {
    List<PatientFileRes> files = patientFileService.getPatientFiles(patientId);
    return ResponseEntity.ok(new ApiRes<>(files));
  }

  @DeleteMapping("/{fileId}/delete-file")
  public ResponseEntity<Void> deleteFile(@PathVariable("fileId") Long fileId) {
    patientFileService.deletePatientFile(fileId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  // Unused api
  @DeleteMapping("/{patientId}/delete-patient-files")
  public ResponseEntity<ApiRes<String>> deleteFiles(@PathVariable("patientId") Long patientId) {
    patientFileService.deletePatientFiles(patientId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  // Unused api
  @PostMapping("/upload-multiple")
  public ResponseEntity<Void> uploadFiles(
      @RequestParam("patientId") Long patientId,
      @RequestParam("fileType") String fileType,
      @RequestParam("description") String description,
      @RequestPart("files") List<MultipartFile> files) {

    files.forEach(file -> {
      PatientFileReq requestDto = new PatientFileReq();
      requestDto.setPatientId(patientId);
      requestDto.setFileType(fileType);
      requestDto.setDescription(description);
      patientFileService.uploadPatientFile(requestDto, file);
    });
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // Unused api
  @PostMapping("/{fileId}")
  public ResponseEntity<Void> updateFile(
      @PathVariable("fileId") Long fileId,
      @RequestBody PatientFileReq patientFileReq) {

    patientFileService.updatePatientFile(fileId, patientFileReq);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
