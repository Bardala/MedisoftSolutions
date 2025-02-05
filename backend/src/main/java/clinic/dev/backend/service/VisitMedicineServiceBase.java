package clinic.dev.backend.service;

import clinic.dev.backend.model.VisitMedicine;
import java.util.List;
import java.util.Optional;

public interface VisitMedicineServiceBase {
  List<VisitMedicine> findAll();

  Optional<VisitMedicine> findById(Long id);

  VisitMedicine save(VisitMedicine visitMedicine);

  void deleteById(Long id);

  List<VisitMedicine> getByVisit(Long visitId); // Get VisitMedicines by Visit ID

  List<VisitMedicine> getByMedicine(Long medicineId); // Get VisitMedicines by Medicine ID
}