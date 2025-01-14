package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.VisitDentalProcedure;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitDentalProcedureService {

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  public VisitDentalProcedure create(VisitDentalProcedure visitDentalProcedure) {
    return visitDentalProcedureRepo.save(visitDentalProcedure);
  }

  public VisitDentalProcedure update(Long id, VisitDentalProcedure updatedVisitDentalProcedure) {
    VisitDentalProcedure existingVisitDentalProcedure = getById(id);
    existingVisitDentalProcedure.setVisit(updatedVisitDentalProcedure.getVisit());
    existingVisitDentalProcedure.setDentalProcedure(updatedVisitDentalProcedure.getDentalProcedure());
    return visitDentalProcedureRepo.save(existingVisitDentalProcedure);
  }

  public void delete(Long id) {
    visitDentalProcedureRepo.deleteById(id);
  }

  public VisitDentalProcedure getById(Long id) {
    return visitDentalProcedureRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("VisitDentalProcedure not found"));
  }

  public List<VisitDentalProcedure> getAll() {
    return visitDentalProcedureRepo.findAll();
  }
}