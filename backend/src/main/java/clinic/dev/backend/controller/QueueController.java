package clinic.dev.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import clinic.dev.backend.dto.queue.QueueReqDTO;
import clinic.dev.backend.dto.queue.QueueResDTO;
import clinic.dev.backend.model.Queue.Status;
import clinic.dev.backend.service.impl.QueueService;
import clinic.dev.backend.util.ApiRes;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/queue")
@RequiredArgsConstructor
public class QueueController {

  private final QueueService queueService;

  @PostMapping
  public ResponseEntity<ApiRes<QueueResDTO>> addPatientToQueue(@RequestBody @Valid QueueReqDTO request) {
    QueueResDTO queue = queueService.addPatientToQueue(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new ApiRes<>(queue));
  }

  @GetMapping("/doctor/{doctorId}")
  public ResponseEntity<ApiRes<List<QueueResDTO>>> getQueueForDoctor(@PathVariable("doctorId") Long doctorId) {
    List<QueueResDTO> queue = queueService.getQueueForDoctor(doctorId);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  @GetMapping("/doctor/{doctorId}/queue/{position}")
  public ResponseEntity<ApiRes<QueueResDTO>> getQueueByPosition(
      @PathVariable("doctorId") Long doctorId,
      @PathVariable("position") Integer position) {

    QueueResDTO queue = queueService.getQueueByPosition(doctorId, position);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  @PutMapping("/{queueId}/position")
  public ResponseEntity<ApiRes<QueueResDTO>> updateQueuePosition(@PathVariable("queueId") Long queueId,
      @RequestBody int newPosition) {
    System.out.println("New Position: " + newPosition);
    QueueResDTO queue = queueService.updateQueuePosition(queueId, newPosition);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  @PutMapping("/{queueId}/status")
  public ResponseEntity<ApiRes<QueueResDTO>> updateQueueStatus(@PathVariable("queueId") Long queueId,
      @RequestBody Status status) {
    QueueResDTO queue = queueService.updateQueueStatus(queueId, status);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  @DeleteMapping("/{queueId}")
  public ResponseEntity<ApiRes<Void>> removePatientFromQueue(@PathVariable("queueId") Long queueId) {
    queueService.removePatientFromQueue(queueId);
    return ResponseEntity.noContent().build();
  }
}
