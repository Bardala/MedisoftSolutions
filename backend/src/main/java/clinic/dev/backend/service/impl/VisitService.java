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
    existingVisit.setAssistant(updatedVisit.getAssistant());
    existingVisit.setDoctor(updatedVisit.getDoctor());
    existingVisit.setDoctorNotes(updatedVisit.getDoctorNotes());
    existingVisit.setDuration(updatedVisit.getDuration());
    existingVisit.setPatient(updatedVisit.getPatient());
    existingVisit.setWait(updatedVisit.getWait());

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
