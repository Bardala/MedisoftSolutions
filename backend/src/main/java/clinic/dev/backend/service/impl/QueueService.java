package clinic.dev.backend.service.impl;

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
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.QueueRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.util.AuthContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueueService {

  @Autowired
  private QueueRepo queueRepository;
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  public QueueResDTO addPatientToQueue(QueueReqDTO req) {

    Integer nextPosition = queueRepository
        .findMaxPositionByDoctorId(req.doctorId())
        .orElse(0) + 1;
    Status status = Status.WAITING;

    User assistant = userRepo
        .findByIdAndClinicId(req.assistantId(), getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Assistant not found")),

        doctor = userRepo
            .findByIdAndClinicId(req.doctorId(), getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

    if (!assistant.getRole().equals("Assistant"))
      throw new BadRequestException("User with id: " + assistant.getId() + " is not an assistant");
    if (doctor.getRole().equals("Assistant")) // doctor can be Admin or Doctor, but can't be Assistant
      throw new BadRequestException("User with id: " + assistant.getId() + " is not a doctor");

    Queue queue = req.toEntity(getClinicId(), nextPosition, status);
    return QueueResDTO.fromEntity(queueRepository.save(queue));
  }

  public List<QueueResDTO> getQueueForDoctor(Long doctorId) {
    return queueRepository
        .findByDoctorIdAndClinicIdOrderByPositionAsc(doctorId, getClinicId()).stream()
        .map(QueueResDTO::fromEntity).toList();
  }

  public QueueResDTO updateQueueStatus(Long queueId, Status status) {
    Queue queue = queueRepository.findByIdAndClinicId(queueId, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found with ID: " + queueId));

    queue.setStatus(status);
    return QueueResDTO.fromEntity(queueRepository.save(queue));
  }

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
    return QueueResDTO.fromEntity(queueRepository.save(queue));
  }

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

  public QueueResDTO getQueueByPosition(Long doctorId, Integer position) {
    Queue queue = queueRepository
        .findByDoctorIdAndPositionAndClinicId(doctorId, position, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Not Found"));

    return QueueResDTO.fromEntity(queue);
  }
}
