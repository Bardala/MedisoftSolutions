package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.DentalProcedure;
import clinic.dev.backend.repository.DentalProcedureRepo;
import clinic.dev.backend.repository.VisitDentalProcedureRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DentalProcedureService implements BaseService<DentalProcedure> {

  @Autowired
  private DentalProcedureRepo serviceRepository;

  @Autowired
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  @Override
  public DentalProcedure create(DentalProcedure service) {
    return serviceRepository.save(service);
  }

  @Override
  public DentalProcedure update(Long id, DentalProcedure updatedService) {
    DentalProcedure existingService = getById(id);
    existingService.setServiceName(updatedService.getServiceName());
    existingService.setDescription(updatedService.getDescription());
    existingService.setCost(updatedService.getCost());
    return serviceRepository.save(existingService);
  }

  @Override
  @Transactional
  public void delete(Long id) {
    visitDentalProcedureRepo.deleteByDentalProcedureId(id);
    serviceRepository.deleteById(id);
  }

  @Override
  public DentalProcedure getById(Long id) {
    return serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Service not found"));
  }

  @Override
  public List<DentalProcedure> getAll() {
    return serviceRepository.findAll();
  }

  public void deleteAll() {
    serviceRepository.deleteAll();
  }
}
