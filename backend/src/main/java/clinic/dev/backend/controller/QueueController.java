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

import clinic.dev.backend.dto.queue.AddPatientToQueueReq;
import clinic.dev.backend.model.Queue;
import clinic.dev.backend.service.impl.QueueService;
import clinic.dev.backend.util.ApiRes;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/queue")
@RequiredArgsConstructor
public class QueueController {

  private final QueueService queueService;

  /**
   * Adds a patient to the queue.
   *
   * @param request the request body containing patient, doctor, and assistant IDs
   * @return the saved Queue object
   */
  @PostMapping
  public ResponseEntity<ApiRes<Queue>> addPatientToQueue(@RequestBody AddPatientToQueueReq request) {
    Queue queue = queueService.addPatientToQueue(
        request.getPatientId(),
        request.getDoctorId(),
        request.getAssistantId());
    return ResponseEntity.status(HttpStatus.CREATED).body(new ApiRes<>(queue));
  }

  /**
   * Retrieves the queue for a specific doctor.
   *
   * @param doctorId the ID of the doctor
   * @return the list of Queue objects
   */
  @GetMapping("/doctor/{doctorId}")
  public ResponseEntity<ApiRes<List<Queue>>> getQueueForDoctor(@PathVariable Long doctorId) {
    List<Queue> queue = queueService.getQueueForDoctor(doctorId);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  /**
   * Updates the position of a patient in the queue.
   *
   * @param queueId     the ID of the queue entry
   * @param newPosition the new position
   * @return the updated Queue object
   */
  @PutMapping("/{queueId}/position")
  public ResponseEntity<ApiRes<Queue>> updateQueuePosition(@PathVariable Long queueId, @RequestBody int newPosition) {
    Queue queue = queueService.updateQueuePosition(queueId, newPosition);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  /**
   * Updates the status of a queue entry.
   *
   * @param queueId the ID of the queue entry
   * @param status  the new status
   * @return the updated Queue object
   */
  @PutMapping("/{queueId}/status")
  public ResponseEntity<ApiRes<Queue>> updateQueueStatus(@PathVariable Long queueId,
      @RequestBody Queue.Status status) {
    Queue queue = queueService.updateQueueStatus(queueId, status);
    return ResponseEntity.ok(new ApiRes<>(queue));
  }

  /**
   * Removes a patient from the queue.
   *
   * @param queueId the ID of the queue entry
   */
  @DeleteMapping("/{queueId}")
  public ResponseEntity<ApiRes<Void>> removePatientFromQueue(@PathVariable Long queueId) {
    queueService.removePatientFromQueue(queueId);
    return ResponseEntity.noContent().build();
  }
}
