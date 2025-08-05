package clinic.dev.backend.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

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
import clinic.dev.backend.model.Visit;
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

    // Handle status transitions
    switch (status) {
      case IN_PROGRESS:
        if (queue.getStatus() == Status.WAITING) {
          updateVisitTiming(queue, true);
        }
        break;

      case COMPLETED:
        if (queue.getStatus() == Status.IN_PROGRESS) {
          updateVisitTiming(queue, false);
        }
        break;

      default:
        break;
    }

    queue.setStatus(status);
    queue.setUpdatedAt(Instant.now());

    return QueueResDTO.fromEntity(queue);
  }

  @Override
  @Transactional
  public QueueResDTO updateQueuePosition(Long queueId, int newPosition) {
    Queue queue = queueRepository.findByIdAndClinicId(queueId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found with ID: " + queueId));

    int oldPosition = queue.getPosition();
    Long doctorId = queue.getDoctor().getId();

    if (oldPosition != newPosition) {
      // Retrieve all queues for the doctor
      List<Queue> doctorQueue = queueRepository.findByDoctorIdOrderByPositionAsc(doctorId);

      if (oldPosition < newPosition) {
        // Move down: Shift all entries between oldPosition and newPosition up
        for (Queue entry : doctorQueue) {
          if (entry.getPosition() > oldPosition && entry.getPosition() <= newPosition) {
            entry.setPosition(entry.getPosition() - 1);
            queueRepository.save(entry);
          }
        }
      } else {
        // Move up: Shift all entries between newPosition and oldPosition down
        for (Queue entry : doctorQueue) {
          if (entry.getPosition() >= newPosition && entry.getPosition() < oldPosition) {
            entry.setPosition(entry.getPosition() + 1);
            queueRepository.save(entry);
          }
        }
      }
    }

    // Set the new position for the current queue entry
    queue.setPosition(newPosition);
    return queueRepository.findQueueDtoByIdAndClinicId(queue.getId(), getClinicId())
        .orElseThrow(() -> new RuntimeException("Queue not found after saving"));
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

  private void updateVisitTiming(Queue queue, boolean isStart) {
    Instant now = Instant.now();
    Optional<Visit> visitOpt = visitRepo.findByPatientAndDoctorAndTimeRange(
        queue.getPatient().getId(),
        queue.getDoctor().getId(),
        now.minus(15, ChronoUnit.MINUTES),
        now.plus(15, ChronoUnit.MINUTES));

    Visit visit = visitOpt.orElseGet(() -> {
      // Create new visit for non-scheduled patients
      Visit newVisit = new Visit();
      newVisit.setPatient(queue.getPatient());
      newVisit.setClinic(queue.getClinic());
      newVisit.setDoctor(queue.getDoctor());
      newVisit.setAssistant(queue.getAssistant());
      return visitRepo.save(newVisit);
    });

    if (isStart) {
      // Set wait time (time from queue creation to IN_PROGRESS)
      long waitMinutes = ChronoUnit.MINUTES.between(queue.getCreatedAt(), now);
      visit.setWait((int) waitMinutes);
    } else {
      // Set duration (time from IN_PROGRESS to COMPLETED)
      if (visit.getWait() != null) {
        long durationMinutes = ChronoUnit.MINUTES.between(
            queue.getCreatedAt().plus(visit.getWait(), ChronoUnit.MINUTES),
            now);
        visit.setDuration((int) durationMinutes);
      }
    }
    visitRepo.save(visit);
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
