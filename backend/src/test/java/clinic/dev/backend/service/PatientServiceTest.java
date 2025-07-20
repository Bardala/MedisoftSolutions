package clinic.dev.backend.service;

import clinic.dev.backend.dto.patient.*;
import clinic.dev.backend.dto.patient.statistics.PatientStatisticsDTO;
import clinic.dev.backend.exceptions.*;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;
import clinic.dev.backend.service.impl.PatientFileService;
import clinic.dev.backend.service.impl.PatientService;
import clinic.dev.backend.util.AuthContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

  @Mock
  private PatientRepo patientRepo;

  @Mock
  private VisitRepo visitRepo;

  @Mock
  private PaymentRepo paymentRepo;

  @Mock
  private VisitDentalProcedureRepo visitDentalProcedureRepo;

  @Mock
  private VisitMedicineRepo visitMedicineRepo;

  @Mock
  private VisitPaymentRepo visitPaymentRepo;

  @Mock
  private PatientFileService patientFileService;

  @Mock
  private QueueRepo queueRepo;

  @Mock
  private AuthContext authContext;

  @Mock
  private ClinicLimitsRepo clinicLimitsRepo;

  @InjectMocks
  private PatientService patientService;

  private final Long clinicId = 1L;
  private final ZoneId zoneId = ZoneId.systemDefault();
  private Patient testPatient;

  @BeforeEach
  void setUp() {
    when(authContext.getClinicId()).thenReturn(clinicId);

    testPatient = new Patient();
    testPatient.setId(1L);
    testPatient.setFullName("John Doe");
    testPatient.setClinic(new Clinic(clinicId));
  }

  @Test
  void create_shouldSuccessfullyCreatePatient() {
    PatientReqDTO request = new PatientReqDTO("John Doe", "30", "123 Main St",
        25, "No history", "john@example.com");

    when(clinicLimitsRepo.isPatientLimitReached(clinicId)).thenReturn(false);
    when(patientRepo.existsByFullNameAndClinicId("John Doe", clinicId)).thenReturn(false);
    when(patientRepo.save(any(Patient.class))).thenReturn(testPatient);

    PatientResDTO result = patientService.create(request);

    assertNotNull(result);
    assertEquals("John Doe", result.fullName());
    verify(patientRepo).save(any(Patient.class));
  }

  @Test
  void create_shouldThrowWhenClinicLimitReached() {
    PatientReqDTO request = new PatientReqDTO("John Doe", "30", "123 Main St",
        25, "No history", "john@example.com");

    when(clinicLimitsRepo.isPatientLimitReached(clinicId)).thenReturn(true);

    assertThrows(ClinicLimitExceededException.class, () -> patientService.create(request));
  }

  @Test
  void create_shouldThrowWhenPatientNameExists() {
    PatientReqDTO request = new PatientReqDTO("John Doe", "30", "123 Main St",
        25, "No history", "john@example.com");

    when(clinicLimitsRepo.isPatientLimitReached(clinicId)).thenReturn(false);
    when(patientRepo.existsByFullNameAndClinicId("John Doe", clinicId)).thenReturn(true);

    assertThrows(IllegalArgumentException.class, () -> patientService.create(request));
  }

  @Test
  void update_shouldSuccessfullyUpdatePatient() {
    Long patientId = 1L;
    PatientReqDTO request = new PatientReqDTO("John Updated", "31", "456 Main St",
        30, "Updated history", "john.updated@example.com");

    when(patientRepo.findByIdAndClinicId(patientId, clinicId)).thenReturn(Optional.of(testPatient));
    when(patientRepo.save(any(Patient.class))).thenReturn(testPatient);

    PatientResDTO result = patientService.update(patientId, request);

    assertNotNull(result);
    verify(patientRepo).save(any(Patient.class));
  }

  @Test
  void update_shouldThrowWhenPatientNotFound() {
    Long patientId = 1L;
    PatientReqDTO request = new PatientReqDTO("John Updated", "31", "456 Main St",
        30, "Updated history", "john.updated@example.com");

    when(patientRepo.findByIdAndClinicId(patientId, clinicId)).thenReturn(Optional.empty());

    assertThrows(ResourceNotFoundException.class, () -> patientService.update(patientId, request));
  }

  @Test
  void delete_shouldSuccessfullyDeletePatient() {
    Long patientId = 1L;

    when(patientRepo.existsByIdAndClinicId(patientId, clinicId)).thenReturn(true);

    patientService.delete(patientId);

    verify(patientRepo).deleteByIdAndClinicId(patientId, clinicId);
    verify(visitRepo).deleteByPatientIdAndClinicId(patientId, clinicId);
    verify(paymentRepo).deleteByPatientIdAndClinicId(patientId, clinicId);
    verify(patientFileService).deletePatientFiles(patientId);
  }

  @Test
  void delete_shouldThrowWhenPatientNotFound() {
    Long patientId = 1L;

    when(patientRepo.existsByIdAndClinicId(patientId, clinicId)).thenReturn(false);

    assertThrows(UnauthorizedAccessException.class, () -> patientService.delete(patientId));
  }

  @Test
  void getClinicPatientById_shouldReturnPatient() {
    Long patientId = 1L;

    when(patientRepo.findByIdAndClinicId(patientId, clinicId)).thenReturn(Optional.of(testPatient));

    PatientResDTO result = patientService.getClinicPatientById(patientId);

    assertNotNull(result);
    assertEquals("John Doe", result.fullName());
  }

  @Test
  void getClinicPatientById_shouldThrowWhenPatientNotFound() {
    Long patientId = 1L;

    when(patientRepo.findByIdAndClinicId(patientId, clinicId)).thenReturn(Optional.empty());

    assertThrows(ResourceNotFoundException.class, () -> patientService.getClinicPatientById(patientId));
  }

  @Test
  void dailyNewPatients_shouldReturnCombinedResultsBefore6AM() {
    // Set up test time (before 6 AM)
    LocalDate today = LocalDate.now(zoneId);
    ZonedDateTime testTime = today.atTime(5, 0).atZone(zoneId);
    Instant fixedInstant = testTime.toInstant();

    // Set up fixed clock in service (you'll need to add clock to PatientService)
    patientService.setClock(Clock.fixed(fixedInstant, zoneId));

    // Expected time ranges
    Instant at12Am = today.atTime(LocalTime.MIN).atZone(zoneId).toInstant();
    Instant at6Am = at12Am.plus(6, ChronoUnit.HOURS);
    Instant after6AmYesterday = today.minusDays(1).atTime(6, 0).atZone(zoneId).toInstant();

    // Mock data
    Patient patient1 = new Patient();
    patient1.setId(1L);
    Patient patient2 = new Patient();
    patient2.setId(2L);

    when(patientRepo.findPatientsBetween(eq(at12Am), eq(at6Am), eq(clinicId)))
        .thenReturn(List.of(patient1));
    when(patientRepo.findPatientsBetween(eq(after6AmYesterday), eq(at12Am), eq(clinicId)))
        .thenReturn(List.of(patient2));

    // Test
    List<PatientResDTO> result = patientService.dailyNewPatients();

    assertEquals(2, result.size());
    verify(patientRepo).findPatientsBetween(eq(at12Am), eq(at6Am), eq(clinicId));
    verify(patientRepo).findPatientsBetween(eq(after6AmYesterday), eq(at12Am), eq(clinicId));
  }

  @Test
  void dailyNewPatients_shouldReturnSingleResultAfter6AM() {
    // Set up test time (after 6 AM)
    LocalDate today = LocalDate.now(zoneId);
    ZonedDateTime testTime = today.atTime(7, 0).atZone(zoneId);
    Instant fixedInstant = testTime.toInstant();

    // Set up fixed clock in service
    patientService.setClock(Clock.fixed(fixedInstant, zoneId));

    // Expected time ranges
    Instant workdayStart = today.atTime(6, 0).atZone(zoneId).toInstant();
    Instant workdayEnd = workdayStart.plus(24, ChronoUnit.HOURS);

    // Mock data
    Patient patient1 = new Patient();
    patient1.setId(1L);
    Patient patient2 = new Patient();
    patient2.setId(2L);

    when(patientRepo.findPatientsBetween(eq(workdayStart), eq(workdayEnd), eq(clinicId)))
        .thenReturn(List.of(patient1, patient2));

    // Test
    List<PatientResDTO> result = patientService.dailyNewPatients();

    assertEquals(2, result.size());
    verify(patientRepo).findPatientsBetween(eq(workdayStart), eq(workdayEnd), eq(clinicId));
  }

  @Test
  void getDailyNewPatientsForDate_shouldHandleTodayBefore6AM() {
    LocalDate today = LocalDate.now(zoneId);
    Instant now = today.atTime(5, 0).atZone(zoneId).toInstant();

    // Set up fixed clock in service
    patientService.setClock(Clock.fixed(now, zoneId));

    // Test with similar mocking as dailyNewPatients test
    // ...
  }

  @Test
  void searchPatients_shouldReturnFilteredResults() {
    Map<String, String> searchParams = Map.of("fullName", "John", "phone", "555");
    PageRequest pageRequest = PageRequest.of(0, 10);

    List<Patient> patients = List.of(testPatient);
    Page<Patient> patientPage = new PageImpl<>(patients, pageRequest, 1);

    when(patientRepo.findAll(any(Specification.class), eq(pageRequest))).thenReturn(patientPage);

    Page<PatientResDTO> result = patientService.searchPatients(searchParams, 0, 10);

    assertEquals(1, result.getTotalElements());
    verify(patientRepo).findAll(any(Specification.class), eq(pageRequest));
  }

  @Test
  void getPatientRegistry_shouldReturnCompleteRegistry() {
    Long patientId = 1L;

    when(patientRepo.findByIdAndClinicId(patientId, clinicId)).thenReturn(Optional.of(testPatient));
    when(visitRepo.findByPatientIdAndClinicId(patientId, clinicId)).thenReturn(List.of(new Visit()));
    when(paymentRepo.findByPatientIdAndClinicId(patientId, clinicId)).thenReturn(List.of(new Payment()));
    when(visitDentalProcedureRepo.findByVisitPatientIdAndClinicId(patientId, clinicId))
        .thenReturn(List.of(new VisitDentalProcedure()));
    when(visitMedicineRepo.findByVisitPatientIdAndClinicId(patientId, clinicId))
        .thenReturn(List.of(new VisitMedicine()));
    when(visitPaymentRepo.findByVisitPatientIdAndClinicId(patientId, clinicId))
        .thenReturn(List.of(new VisitPayment()));

    PatientRegistryRes result = patientService.getPatientRegistry(patientId);

    assertNotNull(result);
    assertNotNull(result.getPatient());
    assertFalse(result.getVisits().isEmpty());
    assertFalse(result.getPayments().isEmpty());
    assertFalse(result.getVisitDentalProcedure().isEmpty());
    assertFalse(result.getVisitMedicines().isEmpty());
    assertFalse(result.getVisitPayments().isEmpty());
  }

  // @Test
  // void getPatientStatistics_shouldReturnStatistics() {
  // when(patientRepo.countPatientsByAgeGroups(clinicId)).thenReturn(List.of(new
  // Object[] { "adult", 10 }));
  // when(patientRepo.countPatientsByAddress(clinicId)).thenReturn(List.of(new
  // Object[] { "New York", 5 }));
  // when(patientRepo.countPatientsByMonth(clinicId, LocalDate.now().getYear()))
  // .thenReturn(List.of(new Object[] { 2023, 1, 3 }));

  // PatientStatisticsDTO result = patientService.getPatientStatistics();

  // assertNotNull(result);
  // assertFalse(result.ageDistribution().isEmpty());
  // assertFalse(result.addressDistribution().isEmpty());
  // assertFalse(result.registrationTrend().isEmpty());
  // }

  // @Test
  // void getPatientsByIds_shouldThrowWhenIdsEmpty() {
  // assertThrows(BadRequestException.class, () ->
  // patientService.getPatientsByIds(Collections.emptyList()));
  // }

  // @Test
  // void getPatientsByIds_shouldThrowWhenPatientsNotFound() {
  // List<Long> ids = List.of(1L, 2L);
  // when(patientRepo.findByIdInAndClinicId(ids,
  // clinicId)).thenReturn(List.of(testPatient));

  // assertThrows(ResourceNotFoundException.class, () ->
  // patientService.getPatientsByIds(ids));
  // }
}