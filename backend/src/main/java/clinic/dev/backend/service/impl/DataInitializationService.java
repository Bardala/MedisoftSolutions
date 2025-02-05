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

  @Autowired
  private PaymentRepo paymentRepo;

  @PostConstruct
  public void populateData() {
    addUsers();
    addPatients();
    addMedicines();
    addVisitsAndMedicines();
    addPayments();
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
      assistant.setPassword("888888");
      assistant.setName("Asmaa");
      assistant.setPhone("01112345678");
      assistant.setRole("Assistant");
      userService.signup(assistant);
    }
  }

  private void addPatients() {
    if (patientRepo.count() == 0) {
      Patient patient1 = new Patient();
      patient1.setFullName("محمد علي");
      patient1.setPhone("01098765432");
      patient1.setAge(30);
      patient1.setAddress("القاهرة، مصر");
      patient1.setMedicalHistory("لا توجد حساسية معروفة");
      patientRepo.save(patient1);

      Patient patient2 = new Patient();
      patient2.setFullName("فاطمة حسن");
      patient2.setPhone("01233445566");
      patient2.setAge(25);
      patient2.setAddress("الجيزة، مصر");
      patient2.setMedicalHistory("الربو");
      patientRepo.save(patient2);

      // Adding more patients
      Patient patient3 = new Patient();
      patient3.setFullName("أحمد مصطفى");
      patient3.setPhone("01122334455");
      patient3.setAge(40);
      patient3.setAddress("الإسكندرية، مصر");
      patient3.setMedicalHistory("ضغط الدم المرتفع");
      patientRepo.save(patient3);

      Patient patient4 = new Patient();
      patient4.setFullName("سارة محمد");
      patient4.setPhone("01011223344");
      patient4.setAge(35);
      patient4.setAddress("المنصورة، مصر");
      patient4.setMedicalHistory("سكري النوع الثاني");
      patientRepo.save(patient4);

      Patient patient5 = new Patient();
      patient5.setFullName("يوسف إبراهيم");
      patient5.setPhone("01234567890");
      patient5.setAge(28);
      patient5.setAddress("أسيوط، مصر");
      patient5.setMedicalHistory("لا توجد حساسية معروفة");
      patientRepo.save(patient5);

      Patient patient6 = new Patient();
      patient6.setFullName("مريم أحمد");
      patient6.setPhone("01155667788");
      patient6.setAge(22);
      patient6.setAddress("طنطا، مصر");
      patient6.setMedicalHistory("الربو");
      patientRepo.save(patient6);
    }
  }

  private void addMedicines() {
    if (medicineRepo.count() == 0) {
      List<Medicine> medicines = Arrays.asList(
          createMedicine("Paracetamol", "500 مجم", "مرتين في اليوم", 7, "تناول بعد الأكل"),
          createMedicine("Amoxicillin", "250 مجم", "ثلاث مرات في اليوم", 5, "تناول قبل الأكل"),
          createMedicine("Ibuprofen", "200 مجم", "مرة واحدة في اليوم", 3, "تناول مع الماء"),
          createMedicine("Chlorhexidine Mouthwash", "10 مل", "مرتين في اليوم", 14, "مضمض لمدة 30 ثانية ثم ابصق"),
          createMedicine("Metronidazole", "500 مجم", "كل 12 ساعة", 5, "تجنب الكحول أثناء العلاج"),
          createMedicine("Diclofenac", "50 مجم", "مرتين في اليوم", 7, "تناول بعد الأكل"),
          createMedicine("Clindamycin", "300 مجم", "ثلاث مرات في اليوم", 7, "تناول مع كوب كامل من الماء"),
          createMedicine("Azithromycin", "500 مجم", "مرة واحدة في اليوم", 3,
              "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
          createMedicine("Naproxen", "250 مجم", "مرتين في اليوم", 5, "تناول مع الطعام أو الحليب"),
          createMedicine("Ketoprofen", "100 مجم", "مرتين في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Acyclovir", "400 مجم", "خمس مرات في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Dexamethasone", "0.5 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"));
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
      Patient patient = patientRepo.findByFullName("محمد علي").orElse(null);
      User doctor = userRepo.findByUsername("doctor").orElse(null);
      User assistant = userRepo.findByUsername("assistant").orElse(null);
      Medicine medicine1 = medicineRepo.findByMedicineName("باراسيتامول").orElse(null);
      Medicine medicine2 = medicineRepo.findByMedicineName("أموكسيسيلين").orElse(null);

      if (patient != null && doctor != null && assistant != null) {
        // Visit 1
        Visit visit1 = new Visit();
        visit1.setPatient(patient);
        visit1.setDoctor(doctor);
        visit1.setAssistant(assistant);
        visit1.setWait(15);
        visit1.setDuration(30);
        visit1.setDoctorNotes("فحص دوري");
        visitRepo.save(visit1);

        if (medicine1 != null) {
          VisitMedicine visitMedicine1 = new VisitMedicine();
          visitMedicine1.setVisit(visit1);
          visitMedicine1.setMedicine(medicine1);
          visitMedicineRepo.save(visitMedicine1);
        }

        // Visit 2
        Visit visit2 = new Visit();
        visit2.setPatient(patient);
        visit2.setDoctor(doctor);
        visit2.setAssistant(assistant);
        visit2.setWait(10);
        visit2.setDuration(20);
        visit2.setDoctorNotes("علاج تسوس الأسنان");
        visitRepo.save(visit2);

        if (medicine2 != null) {
          VisitMedicine visitMedicine2 = new VisitMedicine();
          visitMedicine2.setVisit(visit2);
          visitMedicine2.setMedicine(medicine2);
          visitMedicineRepo.save(visitMedicine2);
        }

        // Visit 3
        Visit visit3 = new Visit();
        visit3.setPatient(patient);
        visit3.setDoctor(doctor);
        visit3.setAssistant(assistant);
        visit3.setWait(20);
        visit3.setDuration(40);
        visit3.setDoctorNotes("تنظيف الأسنان");
        visitRepo.save(visit3);

        if (medicine1 != null) {
          VisitMedicine visitMedicine3 = new VisitMedicine();
          visitMedicine3.setVisit(visit3);
          visitMedicine3.setMedicine(medicine1);
          visitMedicineRepo.save(visitMedicine3);
        }
      }
    }
  }

  private void addPayments() {
    if (paymentRepo.count() == 0) {
      Patient patient = patientRepo.findByFullName("محمد علي").orElse(null);
      User recordedBy = userRepo.findByUsername("admin").orElse(null);

      if (patient != null && recordedBy != null) {
        Payment payment1 = new Payment();
        payment1.setPatient(patient);
        payment1.setAmount(200.0);
        payment1.setRecordedBy(recordedBy);
        paymentRepo.save(payment1);

        Payment payment2 = new Payment();
        payment2.setPatient(patient);
        payment2.setAmount(150.0);
        payment2.setRecordedBy(recordedBy);
        paymentRepo.save(payment2);

        Payment payment3 = new Payment();
        payment3.setPatient(patient);
        payment3.setAmount(300.0);
        payment3.setRecordedBy(recordedBy);
        paymentRepo.save(payment3);

        Payment payment4 = new Payment();
        payment4.setPatient(patient);
        payment4.setAmount(250.0);
        payment4.setRecordedBy(recordedBy);
        paymentRepo.save(payment4);

        Payment payment5 = new Payment();
        payment5.setPatient(patient);
        payment5.setAmount(100.0);
        payment5.setRecordedBy(recordedBy);
        paymentRepo.save(payment5);
      }
    }
  }

}
