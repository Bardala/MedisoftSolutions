package clinic.dev.backend.service;

import java.util.List;

import clinic.dev.backend.dto.queue.QueueReqDTO;
import clinic.dev.backend.dto.queue.QueueResDTO;
import clinic.dev.backend.model.Queue.Status;

public interface QueueServiceBase {

  QueueResDTO addPatientToQueue(QueueReqDTO req);

  List<QueueResDTO> getQueueForDoctor(Long doctorId);

  QueueResDTO updateQueueStatus(Long queueId, Status status);

  QueueResDTO updateQueuePosition(Long queueId, int newPosition);

  void removePatientFromQueue(Long queueId);

  QueueResDTO getQueueByPosition(Long doctorId, Integer position);

  Boolean CheckPatientInQueue(Long patientId);

}