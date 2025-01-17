package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.model.*;
import clinic.dev.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializationService {

  @Autowired
  private PatientRepo patientRepo;

  @Autowired
  private UserRepo userRepo;

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitRepo visitRepo;

  @Autowired
  UserService userService;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @PostConstruct
  public void populateData() {
    addUsers();
    addPatients();
    addMedicines();
    addVisitsAndMedicines();
  }

  private void addUsers() {
    if (userRepo.count() == 0) {
      SignupRequest doctor = new SignupRequest();
      doctor.setUsername("doctor");
      doctor.setPassword("888888");
      doctor.setName("Dr. Mohamad Sameer");
      doctor.setPhone("01234567890");
      doctor.setRole("Doctor");
      userService.signup(doctor);

      SignupRequest assistant = new SignupRequest();
      assistant.setUsername("assistant");
      assistant.setPassword("password");
      assistant.setName("Asmaa");
      assistant.setPhone("01112345678");
      assistant.setRole("Assistant");
      userService.signup(assistant);
    }
  }

  private void addPatients() {
    if (patientRepo.count() == 0) {
      Patient patient1 = new Patient();
      patient1.setFullName("Mohamed Ali");
      patient1.setPhone("01098765432");
      patient1.setAge(30);
      patient1.setAddress("Cairo, Egypt");
      patient1.setMedicalHistory("No known allergies");
      patientRepo.save(patient1);

      Patient patient2 = new Patient();
      patient2.setFullName("Fatma Hassan");
      patient2.setPhone("01233445566");
      patient2.setAge(25);
      patient2.setAddress("Giza, Egypt");
      patient2.setMedicalHistory("Asthma");
      patientRepo.save(patient2);
    }
  }

  private void addMedicines() {
    if (medicineRepo.count() == 0) {
      List<Medicine> medicines = Arrays.asList(
          createMedicine("Paracetamol", "500 mg", "Twice a day", 7, "Take after meals"),
          createMedicine("Amoxicillin", "250 mg", "Three times a day", 5, "Take before meals"),
          createMedicine("Ibuprofen", "200 mg", "Once a day", 3, "Take with water"));
      createMedicine("Chlorhexidine Mouthwash", "10 ml", "Twice a day", 14, "Rinse for 30 seconds and spit out");
      createMedicine("Metronidazole", "500 mg", "Every 12 hours", 5, "Avoid alcohol during treatment");
      medicineRepo.saveAll(medicines);
    }
  }

  private Medicine createMedicine(String name, String dosage, String frequency, int duration, String instructions) {
    Medicine medicine = new Medicine();
    medicine.setMedicineName(name);
    medicine.setDosage(dosage);
    medicine.setFrequency(frequency);
    medicine.setDuration(duration);
    medicine.setInstructions(instructions);
    return medicine;
  }

  private void addVisitsAndMedicines() {
    if (visitRepo.count() == 0) {
      Patient patient = patientRepo.findByFullName("Mohamed Ali").orElse(null);
      User doctor = userRepo.findByUsername("doctor1").orElse(null);
      User assistant = userRepo.findByUsername("assistant1").orElse(null);
      Medicine medicine = medicineRepo.findByMedicineName("Paracetamol").orElse(null);

      if (patient != null && doctor != null && assistant != null && medicine != null) {
        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setDoctor(doctor);
        visit.setAssistant(assistant);
        visit.setWait(15);
        visit.setDuration(30);
        visit.setDoctorNotes("Regular checkup");
        visitRepo.save(visit);

        VisitMedicine visitMedicine = new VisitMedicine();
        visitMedicine.setVisit(visit);
        visitMedicine.setMedicine(medicine);
        visitMedicineRepo.save(visitMedicine);
      }
    }
  }
}
