package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.VisitMedicine;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.service.VisitMedicineServiceBase;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VisitMedicineService implements VisitMedicineServiceBase {

  @Autowired
  private VisitMedicineRepo visitMedicineRepository;

  @Override
  public List<VisitMedicine> findAll() {
    return visitMedicineRepository.findAll();
  }

  @Override
  public Optional<VisitMedicine> findById(Long id) {
    return visitMedicineRepository.findById(id);
  }

  @Override
  public VisitMedicine save(VisitMedicine visitMedicine) {
    return visitMedicineRepository.save(visitMedicine);
  }

  @Override
  public void deleteById(Long id) {
    visitMedicineRepository.deleteById(id);
  }

  @Override
  public List<VisitMedicine> getByVisit(Long visitId) {
    return visitMedicineRepository.findByVisitId(visitId);
  }

  @Override
  public List<VisitMedicine> getByMedicine(Long medicineId) {
    return visitMedicineRepository.findByMedicineId(medicineId);
  }

}