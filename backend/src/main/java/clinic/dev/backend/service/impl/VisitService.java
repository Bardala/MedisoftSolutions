package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitService implements BaseService<Visit> {

  @Autowired
  private VisitRepo visitRepo;

  @Override
  public Visit create(Visit visit) {
    return visitRepo.save(visit);
  }

  @Override
  public Visit update(Long id, Visit updatedVisit) {
    Visit existingVisit = getById(id);
    existingVisit.setPatient(updatedVisit.getPatient());
    existingVisit.setService(updatedVisit.getService());
    existingVisit.setDate(updatedVisit.getDate());
    existingVisit.setPayment(updatedVisit.getPayment());
    return visitRepo.save(existingVisit);
  }

  @Override
  public void delete(Long id) {
    visitRepo.deleteById(id);
  }

  @Override
  public Visit getById(Long id) {
    return visitRepo.findById(id).orElseThrow(() -> new RuntimeException("Visit not found"));
  }

  @Override
  public List<Visit> getAll() {
    return visitRepo.findAll();
  }
}
