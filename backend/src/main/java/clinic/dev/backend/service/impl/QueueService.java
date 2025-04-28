package clinic.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.Queue;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.repository.QueueRepo;
import clinic.dev.backend.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueueService {

  private final QueueRepo queueRepository;
  private final PatientRepo patientRepository;
  private final UserRepo userRepository;

  /**
   * Adds a patient to the queue for a specific doctor.
   *
   * @param patientId   the ID of the patient
   * @param doctorId    the ID of the doctor
   * @param assistantId the ID of the assistant (optional)
   * @return the saved Queue object
   */
  public Queue addPatientToQueue(Long patientId, Long doctorId, Long assistantId) {
    Patient patient = patientRepository.findById(patientId)
        .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
    User doctor = userRepository.findById(doctorId)
        .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + doctorId));
    User assistant = assistantId != null
        ? userRepository.findById(assistantId).orElse(null)
        : null;

    // Calculate the next position in the queue for the doctor
    int nextPosition = queueRepository.findMaxPositionByDoctorId(doctorId).orElse(0) + 1;

    Queue queue = new Queue();
    queue.setPatient(patient);
    queue.setDoctor(doctor);
    queue.setAssistant(assistant);
    queue.setPosition(nextPosition);
    queue.setStatus(Queue.Status.WAITING);

    return queueRepository.save(queue);
  }

  /**
   * Retrieves the queue for a specific doctor.
   *
   * @param doctorId the ID of the doctor
   * @return the list of Queue objects
   */
  public List<Queue> getQueueForDoctor(Long doctorId) {
    return queueRepository.findByDoctorIdOrderByPositionAsc(doctorId);
  }

  /**
   * Updates the status of a queue entry.
   *
   * @param queueId the ID of the queue entry
   * @param status  the new status to set
   * @return the updated Queue object
   */
  public Queue updateQueueStatus(Long queueId, Queue.Status status) {
    Queue queue = queueRepository.findById(queueId)
        .orElseThrow(() -> new EntityNotFoundException("Queue entry not found with ID: " + queueId));

    queue.setStatus(status);
    return queueRepository.save(queue);
  }

  /**
   * Updates the position of a patient in the queue.
   *
   * @param queueId     the ID of the queue entry
   * @param newPosition the new position to set
   * @return the updated Queue object
   */
  @Transactional
  public Queue updateQueuePosition(Long queueId, int newPosition) {
    Queue queue = queueRepository.findById(queueId)
        .orElseThrow(() -> new EntityNotFoundException("Queue entry not found with ID: " + queueId));

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
    return queueRepository.save(queue);
  }

  /**
   * Removes a patient from the queue.
   *
   * @param queueId the ID of the queue entry
   */
  @Transactional
  public void removePatientFromQueue(Long queueId) {
    Queue queue = queueRepository.findById(queueId)
        .orElseThrow(() -> new EntityNotFoundException("Queue entry not found with ID: " + queueId));

    int removedPosition = queue.getPosition();
    Long doctorId = queue.getDoctor().getId();

    // Retrieve all queues for the doctor
    List<Queue> doctorQueue = queueRepository.findByDoctorIdOrderByPositionAsc(doctorId);

    // Remove the queue entry
    queueRepository.deleteById(queueId);

    // Shift positions of entries after the removed position
    for (Queue entry : doctorQueue) {
      if (entry.getPosition() > removedPosition) {
        entry.setPosition(entry.getPosition() - 1);
        queueRepository.save(entry);
      }
    }
  }
}
