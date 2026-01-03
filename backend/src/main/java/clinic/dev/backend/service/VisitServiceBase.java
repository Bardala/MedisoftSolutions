package clinic.dev.backend.service;

import java.time.LocalDate;
import java.util.List;

import clinic.dev.backend.dto.visit.VisitReqDTO;
import clinic.dev.backend.dto.visit.VisitResDTO;

public interface VisitServiceBase {

  VisitResDTO create(VisitReqDTO req);

  VisitResDTO update(Long id, VisitReqDTO req);

  void delete(Long id);

  VisitResDTO getById(Long id);

  List<VisitResDTO> getAll();

  List<VisitResDTO> getVisitsForDate(LocalDate date);

  List<VisitResDTO> getVisitsByIds(List<Long> ids);

  List<VisitResDTO> getAppointmentsByDay(LocalDate date);

  List<VisitResDTO> getAppointmentsByWeek(LocalDate startDate);

}