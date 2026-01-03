package clinic.dev.backend.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.visit.VisitResDTO;
import clinic.dev.backend.model.Visit;

public interface VisitRepo extends JpaRepository<Visit, Long> {

    List<Visit> findByPatientId(Long id);

    void deleteByPatientId(Long id);

    List<Visit> findByClinicId(Long clinicId);

    List<Visit> findByClinicIdAndPatientId(Long clinicId, Long patientId);

    void deleteByPatientIdAndClinicId(Long id, Long clinicId);

    List<Visit> findByPatientIdAndClinicId(Long id, Long clinicId);

    Optional<Visit> findByIdAndClinicId(Long id, Long clinicId);

    List<Visit> findAllByClinicId(Long clinicId);

    List<Visit> findByIdInAndClinicId(List<Long> ids, Long clinicId);

    @Query("SELECT v FROM Visit v " +
            "JOIN FETCH v.patient " +
            "JOIN FETCH v.doctor " +
            "LEFT JOIN FETCH v.assistant " +
            "WHERE v.id = :id AND v.clinic.id = :clinicId")
    Optional<Visit> findByIdAndClinicIdWithRelations(@Param("id") Long id, @Param("clinicId") Long clinicId);

    @Query("""
                SELECT new clinic.dev.backend.dto.visit.VisitResDTO(
                    v.id,

                    p.id,
                    p.fullName,
                    p.phone,

                    c.id,

                    d.id,
                    d.name,

                    a.id,
                    a.name,

                    v.wait,
                    v.duration,
                    v.doctorNotes,
                    v.createdAt,
                    v.scheduledTime,
                    v.reason
                )
                FROM Visit v
                JOIN v.patient p
                JOIN v.doctor d
                LEFT JOIN v.assistant a
                JOIN v.clinic c
                WHERE v.id = :id AND c.id = :clinicId
            """)
    Optional<VisitResDTO> findDtoByIdAndClinicId(@Param("id") Long id, @Param("clinicId") Long clinicId);

    @Query("SELECT v FROM Visit v " +
            "JOIN FETCH v.patient " +
            "JOIN FETCH v.doctor " +
            "LEFT JOIN FETCH v.assistant " +
            "WHERE v.id = :id")
    Optional<Visit> findByIdWithRelations(@Param("id") Long id);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.clinic.id = :clinicId AND v.createdAt BETWEEN :start AND :end")
    Integer countByClinicIdAndCreatedAtBetween(@Param("clinicId") Long clinicId,
            @Param("start") Instant start,
            @Param("end") Instant end);

    Integer countByDoctorIdAndClinicIdAndCreatedAtBetween(
            Long doctorId,
            Long clinicId,
            Instant start,
            Instant end);

    // List<Visit> findByClinicIdAndCreatedAtBetween(Long clinicId, Instant start,
    // Instant end);

    @Query("SELECT v FROM Visit v " +
            "WHERE v.clinic.id = :clinicId " +
            "AND v.createdAt >= :start " +
            "AND v.createdAt < :end " +
            "ORDER BY v.createdAt DESC")
    List<Visit> findByClinicIdAndCreatedAtBetween(
            @Param("clinicId") Long clinicId,
            @Param("start") Instant start,
            @Param("end") Instant end);

    List<Visit> findByDoctorIdAndClinicIdAndCreatedAtBetween(
            Long doctorId,
            Long clinicId,
            Instant start,
            Instant end);

    // Find scheduled visit for patient/doctor around specific time
    @Query("SELECT v FROM Visit v " +
            "WHERE v.patient.id = :patientId " +
            "AND v.doctor.id = :doctorId " +
            "AND v.scheduledTime BETWEEN :start AND :end")
    Optional<Visit> findByPatientAndDoctorAndTimeRange(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("start") Instant start,
            @Param("end") Instant end);

    // Find upcoming scheduled visits
    @Query("SELECT v FROM Visit v " +
            "WHERE v.scheduledTime BETWEEN :from AND :to " +
            "ORDER BY v.scheduledTime ASC")
    List<Visit> findUpcomingVisits(
            @Param("from") Instant from,
            @Param("to") Instant to);

    // Find completed visits for statistics (only visits with both wait and duration
    // set)
    @Query("SELECT v FROM Visit v " +
            "WHERE v.doctor.id = :doctorId " +
            "AND v.wait IS NOT NULL " +
            "AND v.duration IS NOT NULL " +
            "ORDER BY v.createdAt DESC")
    List<Visit> findCompletedVisitsByDoctor(
            @Param("doctorId") Long doctorId);

    // Additional useful query
    @Query("SELECT v FROM Visit v " +
            "WHERE v.doctor.id = :doctorId " +
            "AND v.scheduledTime IS NOT NULL " +
            "AND v.scheduledTime > :now " +
            "ORDER BY v.scheduledTime ASC")
    List<Visit> findFutureScheduledVisitsByDoctor(
            @Param("doctorId") Long doctorId,
            @Param("now") Instant now);

    @Query("SELECT v FROM Visit v " +
            "WHERE v.clinic.id = :clinicId " +
            "AND v.scheduledTime BETWEEN :start AND :end " +
            "ORDER BY v.scheduledTime ASC")
    List<Visit> findByClinicIdAndScheduledTimeBetween(
            @Param("clinicId") Long clinicId,
            @Param("start") Instant start,
            @Param("end") Instant end);

    List<Visit> findByClinicIdAndDoctorIdAndScheduledTimeBetween(Long clinicId, Long doctorId, Instant start,
            Instant end);

    List<Visit> findByDoctorIdAndClinicIdAndScheduledTimeBetween(
            Long doctorId,
            Long clinicId,
            Instant start,
            Instant end);

    List<Visit> findByClinicIdAndDoctorIdAndCreatedAtBetween(Long clinicId, Long doctorId, Instant workdayStart,
            Instant workdayEnd);

}
