package clinic.dev.backend.service.impl;

import clinic.dev.backend.model.DentalProcedure;
import clinic.dev.backend.repository.ServiceRepo;
import clinic.dev.backend.service.BaseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService implements BaseService<DentalProcedure> {

  @Autowired
  private ServiceRepo serviceRepository;

  @Override
  public DentalProcedure create(DentalProcedure service) {
    return serviceRepository.save(service);
  }

  @Override
  public DentalProcedure update(Long id, DentalProcedure updatedService) {
    DentalProcedure existingService = getById(id);
    existingService.setName(updatedService.getName());
    existingService.setDescription(updatedService.getDescription());
    existingService.setPrice(updatedService.getPrice());
    return serviceRepository.save(existingService);
  }

  @Override
  public void delete(Long id) {
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
}
