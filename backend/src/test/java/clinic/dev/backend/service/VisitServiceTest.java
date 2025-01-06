// package clinic.dev.backend.service;

// import clinic.dev.backend.model.DentalProcedure;
// import clinic.dev.backend.model.Patient;
// import clinic.dev.backend.model.Visit;
// import clinic.dev.backend.repository.VisitRepo;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;

// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyLong;
// import static org.mockito.Mockito.*;

// public class VisitServiceTest {

// @Mock
// private VisitRepo visitRepo;

// @InjectMocks
// private BaseService<Visit> visitService;

// private Patient patient;
// private DentalProcedure dentalProcedure;

// @BeforeEach
// public void setUp() {
// MockitoAnnotations.openMocks(this);
// patient = new Patient();
// patient.setName("patient");
// patient.setPhoneNumber("1234567890");
// patient.setAddress("address");
// patient.setMedicalHistory("medical history");

// dentalProcedure = new DentalProcedure();
// dentalProcedure.setName("dental procedure");
// dentalProcedure.setDescription("description");
// dentalProcedure.setPrice(100.0);

// }

// @Test
// public void testCreateVisit() {
// Visit visit = new Visit();
// when(visitRepo.save(any(Visit.class))).thenReturn(visit);

// Visit createdVisit = visitService.create(visit);

// assertEquals(visit, createdVisit);
// verify(visitRepo, times(1)).save(visit);
// }

// @Test
// public void testUpdateVisit() {
// Visit existingVisit = new Visit();
// Long id = existingVisit.getId();

// Visit updatedVisit = new Visit();
// updatedVisit.setPatient(this.patient);
// updatedVisit.setService(dentalProcedure);

// when(visitRepo.findById(anyLong())).thenReturn(Optional.of(existingVisit));
// when(visitRepo.save(any(Visit.class))).thenReturn(existingVisit);

// Visit result = visitService.update(id, updatedVisit);

// assertEquals(updatedVisit.getPatient(), result.getPatient());
// assertEquals(updatedVisit.getService(), result.getService());
// assertEquals(updatedVisit.getDate(), result.getDate());
// verify(visitRepo, times(1)).findById(1L);
// verify(visitRepo, times(1)).save(existingVisit);
// }

// @Test
// public void testGetById() {
// Visit visit = new Visit();
// Long id = visit.getId();
// when(visitRepo.findById(anyLong())).thenReturn(Optional.of(visit));

// Visit result = visitService.getById(id);

// assertEquals(visit, result);
// verify(visitRepo, times(1)).findById(1L);
// }

// @Test
// public void testDeleteVisit() {
// Visit visit = new Visit();
// Long id = visit.getId();
// when(visitRepo.findById(anyLong())).thenReturn(Optional.of(visit));

// visitService.delete(id);

// verify(visitRepo, times(1)).deleteById(1L);
// }
// }