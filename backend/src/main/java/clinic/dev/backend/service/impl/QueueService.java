package clinic.dev.backend.service.impl;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.dto.queue.QueueReqDTO;
import clinic.dev.backend.dto.queue.QueueResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Queue;
import clinic.dev.backend.model.Queue.Status;
import clinic.dev.backend.model.enums.UserRole;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.QueueRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.service.QueueServiceBase;
import clinic.dev.backend.util.AuthContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueueService implements QueueServiceBase {

  @Autowired
  private QueueRepo queueRepository;
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private AuthContext authContext;
  @Autowired
  private VisitRepo visitRepo;

  @Override
  @Transactional
  public QueueResDTO addPatientToQueue(QueueReqDTO req) {
    validateDoctor(req.doctorId());
    validateAssistant(req.assistantId());

    Integer nextPosition = queueRepository
        .findMaxPositionByDoctorId(req.doctorId())
        .orElse(0) + 1;
    Status status = Status.WAITING;

    Queue queue = req.toEntity(getClinicId(), nextPosition, status);

    // Get recent completed queues for this doctor
    List<Queue> previousQueues = queueRepository.findTop10ByDoctorAndStatusOrderByCreatedAtDesc(
        queue.getDoctor(),
        Queue.Status.COMPLETED);

    // Calculate and set estimated wait time
    queue.updateEstimatedWaitTime(previousQueues);

    queueRepository.save(queue);

    // Link with scheduled visit if exists
    handleScheduledVisit(queue);

    return QueueResDTO.fromEntity(queue);
  }

  @Override
  public List<QueueResDTO> getQueueForDoctor(Long doctorId) {
    return queueRepository
        .findByDoctorIdAndClinicIdOrderByPositionAsc(doctorId, getClinicId()).stream()
        .map(QueueResDTO::fromEntity).toList();
  }

  @Override
  @Transactional
  public QueueResDTO updateQueueStatus(Long queueId, Status status) {
    Queue queue = queueRepository.findByIdAndClinicId(queueId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found with ID: " + queueId));

    queue.setStatus(status);
    queue.setUpdatedAt(Instant.now());

    return QueueResDTO.fromEntity(queue);
  }

  @Override
  @Transactional
  public QueueResDTO updateQueuePosition(Long queueId, int newPosition) {
    Queue queue = queueRepository.findByIdAndClinicId(queueId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Queue not found"));

    int oldPosition = queue.getPosition();
    if (oldPosition == newPosition)
      return QueueResDTO.fromEntity(queue);

    // Get historical data for wait time calculation
    List<Queue> completedQueues = queueRepository.findTop10ByDoctorAndStatusOrderByCreatedAtDesc(
        queue.getDoctor(), Queue.Status.COMPLETED);

    // Bulk update positions
    if (oldPosition < newPosition) {
      queueRepository.decrementPositionsBetween(oldPosition + 1, newPosition, queue.getDoctor().getId());
    } else {
      queueRepository.incrementPositionsBetween(newPosition, oldPosition - 1, queue.getDoctor().getId());
    }

    // Update current queue
    queue.setPosition(newPosition);
    queue.updateEstimatedWaitTime(completedQueues);
    queueRepository.save(queue);

    // Update all wait times in single query
    queueRepository.updateAllWaitTimesForDoctor(
        queue.getDoctor().getId(),
        completedQueues.stream()
            .filter(q -> q.getCreatedAt() != null && q.getUpdatedAt() != null)
            .mapToLong(q -> Duration.between(q.getCreatedAt(), q.getUpdatedAt()).toMinutes())
            .average()
            .orElse(15.0));

    return QueueResDTO.fromEntity(queue);
  }

  @Override
  @Transactional
  public void removePatientFromQueue(Long queueId) {
    Queue queue = queueRepository.findByIdAndClinicId(queueId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found with ID: " + queueId));

    int removedPosition = queue.getPosition();
    Long doctorId = queue.getDoctor().getId();

    // Retrieve all queues for the doctor
    List<Queue> doctorQueue = queueRepository.findByDoctorIdOrderByPositionAsc(doctorId);

    // Remove the queue entry
    queueRepository.deleteByIdAndClinicId(queueId, getClinicId());

    // Shift positions of entries after the removed position
    for (Queue entry : doctorQueue) {
      if (entry.getPosition() > removedPosition) {
        entry.setPosition(entry.getPosition() - 1);
        queueRepository.save(entry);
      }
    }
  }

  @Override
  public QueueResDTO getQueueByPosition(Long doctorId, Integer position) {
    Queue queue = queueRepository
        .findByDoctorIdAndPositionAndClinicId(doctorId, position, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException(
            String.format("No patient found at position %d for doctor ID %d", position, doctorId)));

    return queueRepository.findQueueDtoByIdAndClinicId(queue.getId(), getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException(
            String.format("Queue details not found for queue ID %d", queue.getId())));
  }

  @Override
  public Boolean CheckPatientInQueue(Long patientId) {
    return queueRepository.existsByPatientIdAndClinicId(patientId, getClinicId());
  }

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  private void handleScheduledVisit(Queue queue) {
    Instant now = Instant.now();
    visitRepo.findByPatientAndDoctorAndTimeRange(
        queue.getPatient().getId(),
        queue.getDoctor().getId(),
        now.minus(15, ChronoUnit.MINUTES),
        now.plus(15, ChronoUnit.MINUTES)).ifPresent(visit -> {
          // Update existing scheduled visit with queue timing info
          visit.setWait(null); // Reset wait time as we're starting fresh
          visit.setDuration(null);
          visitRepo.save(visit);
        });
  }

  private void validateDoctor(Long doctorId) {
    User doctor = userRepo
        .findByIdAndClinicId(doctorId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

    if (UserRole.ASSISTANT.equals(doctor.getRole())) // doctor can be Admin or Doctor, but can't be Assistant
      throw new BadRequestException("User with id: " + doctor.getId() + " is not a doctor");
  }

  private void validateAssistant(Long assistantId) {
    if (assistantId != null) {
      User assistant = userRepo
          .findByIdAndClinicId(assistantId, getClinicId())
          .orElseThrow(() -> new ResourceNotFoundException("Assistant not found"));

      if (!UserRole.ASSISTANT.equals(assistant.getRole()))
        throw new BadRequestException("User with id: " + assistant.getId() + " is not an assistant");
    }
  }

}
