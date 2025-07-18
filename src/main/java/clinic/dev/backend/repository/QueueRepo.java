package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.queue.QueueResDTO;
import clinic.dev.backend.model.Queue;

public interface QueueRepo extends JpaRepository<Queue, Long> {

  // Optional<Integer> findMaxPositionByDoctorId(Long doctorId);
  @Query("SELECT MAX(q.position) FROM Queue q WHERE q.doctor.id = :doctorId")
  Optional<Integer> findMaxPositionByDoctorId(@Param("doctorId") Long doctorId);

  List<Queue> findByDoctorIdOrderByPositionAsc(Long doctorId);

  @Modifying
  @Query("UPDATE Queue q SET q.position = q.position - 1 WHERE q.position BETWEEN :start AND :end AND q.doctor.id = :doctorId")
  void decrementPositions(@Param("start") int start, @Param("end") int end, @Param("doctorId") Long doctorId);

  @Modifying
  @Query("UPDATE Queue q SET q.position = q.position + 1 WHERE q.position BETWEEN :start AND :end AND q.doctor.id = :doctorId")
  void incrementPositions(@Param("start") int start, @Param("end") int end, @Param("doctorId") Long doctorId);

  void deleteByPatientId(Long id);

  List<Queue> findByClinicId(Long clinicId);

  @Query("SELECT MAX(q.position) FROM Queue q WHERE q.doctor.id = :doctorId AND q.clinic.id = :clinicId")
  Optional<Integer> findMaxPositionByDoctorIdAndClinicId(@Param("doctorId") Long doctorId,
      @Param("clinicId") Long clinicId);

  @Query("SELECT q FROM Queue q WHERE q.doctor.id = :doctorId AND q.clinic.id = :clinicId ORDER BY q.position ASC")
  List<Queue> findByDoctorIdAndClinicIdOrderByPositionAsc(@Param("doctorId") Long doctorId,
      @Param("clinicId") Long clinicId);

  @Modifying
  @Query("UPDATE Queue q SET q.position = q.position - 1 WHERE q.position BETWEEN :start AND :end AND q.doctor.id = :doctorId AND q.clinic.id = :clinicId")
  void decrementPositions(@Param("start") int start, @Param("end") int end, @Param("doctorId") Long doctorId,
      @Param("clinicId") Long clinicId);

  @Modifying
  @Query("UPDATE Queue q SET q.position = q.position + 1 WHERE q.position BETWEEN :start AND :end AND q.doctor.id = :doctorId AND q.clinic.id = :clinicId")
  void incrementPositions(@Param("start") int start, @Param("end") int end, @Param("doctorId") Long doctorId,
      @Param("clinicId") Long clinicId);

  void deleteByPatientIdAndClinicId(Long id, Long clinicId);

  Optional<Queue> findByIdAndClinicId(Long queueId, Long clinicId);

  void deleteByIdAndClinicId(Long queueId, Long clinicId);

  Optional<Queue> findByDoctorIdAndPositionAndClinicId(Long doctorId, Integer position, Long clinicId);

  Boolean existsByPatientIdAndClinicId(Long patientId, Long clinicId);

  @Query("""
      SELECT new clinic.dev.backend.dto.queue.QueueResDTO(
          q.id,
          c.id,

          p.id,
          p.fullName,

          d.id,
          d.name,

          a.id,
          a.name,

          q.position,
          q.status,
          q.estimatedWaitTime,
          q.createdAt,
          q.updatedAt
      )
      FROM Queue q
      JOIN q.clinic c
      JOIN q.patient p
      JOIN q.doctor d
      LEFT JOIN q.assistant a
      WHERE q.id = :id AND c.id = :clinicId
        """)
  Optional<QueueResDTO> findQueueDtoByIdAndClinicId(@Param("id") Long id, @Param("clinicId") Long clinicId);
}
