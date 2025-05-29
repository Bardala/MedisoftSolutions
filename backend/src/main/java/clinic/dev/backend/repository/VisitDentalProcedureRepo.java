package clinic.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO;
import clinic.dev.backend.model.VisitDentalProcedure;

public interface VisitDentalProcedureRepo extends JpaRepository<VisitDentalProcedure, Long> {
  List<VisitDentalProcedure> findByVisitId(Long visitId);

  List<VisitDentalProcedure> findByVisitPatientId(Long id);

  void deleteByVisitPatientId(@Param("patientId") Long patientId);

  void deleteByDentalProcedureId(Long id);

  void deleteByVisitId(Long id);

  void deleteByVisitPatientIdAndClinicId(Long id, Long clinicId);

  List<VisitDentalProcedure> findByVisitPatientIdAndClinicId(Long id, Long clinicId);

  void deleteByDentalProcedureIdAndClinicId(Long id, Long clinicId);

  Optional<VisitDentalProcedure> findByIdAndClinicId(Long id, Long clinicId);

  void deleteByIdAndClinicId(Long id, Long clinicId);

  List<VisitDentalProcedure> findAllByClinicId(Long clinicId);

  List<VisitDentalProcedure> findByVisitIdAndClinicId(Long visitId, Long clinicId);

  @Query("""
          SELECT new clinic.dev.backend.dto.visitProcedure.VisitProcedureResDTO(
              vdp.id,
              v.id,

              dp.id,
              dp.serviceName,
              dp.arabicName,
              dp.description,
              dp.cost,

              c.id
          )
          FROM VisitDentalProcedure vdp
          JOIN vdp.visit v
          JOIN vdp.dentalProcedure dp
          JOIN vdp.clinic c
          WHERE vdp.id = :id AND c.id = :clinicId
      """)
  Optional<VisitProcedureResDTO> findVisitProcedureDtoByIdAndClinicId(@Param("id") Long id,
      @Param("clinicId") Long clinicId);
}