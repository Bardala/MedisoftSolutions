package clinic.dev.backend.service;

import clinic.dev.backend.dto.visitMedicine.VisitMedicineReqDTO;
import clinic.dev.backend.dto.visitMedicine.VisitMedicineResDTO;
import java.util.List;

public interface VisitMedicineServiceBase {
  List<VisitMedicineResDTO> findAll();

  VisitMedicineResDTO findById(Long id);

  VisitMedicineResDTO create(VisitMedicineReqDTO req);

  void deleteById(Long id);

  List<VisitMedicineResDTO> getByVisit(Long visitId); // Get VisitMedicines by Visit ID

  List<VisitMedicineResDTO> getByMedicine(Long medicineId); // Get VisitMedicines by Medicine ID
}