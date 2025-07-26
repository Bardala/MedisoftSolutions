package clinic.dev.backend.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import clinic.dev.backend.dto.auth.SignupRequest;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.enums.UserRole;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.UserRepo;
import jakarta.annotation.PostConstruct;

@Service
@Profile("prod")
public class UserInitializationService {

  @Autowired
  private UserRepo userRepo;

  @Autowired
  UserService userService;

  @Autowired
  private MedicineRepo medicineRepo;

  @PostConstruct
  void populateData() {
    // addUsers();
    // addMedicines();
  }

  private void addUsers() {
    if (userRepo.count() == 0) {
      SignupRequest admin = new SignupRequest();
      admin.setUsername("admin");
      admin.setPassword("888888");
      admin.setName("Bardala");
      admin.setPhone("01120618782");
      admin.setRole(UserRole.SUPER_ADMIN);
      userService.signup(admin);
    }
  }

  private void addMedicines() {
    if (medicineRepo.count() == 0) {
      List<Medicine> medicines = Arrays.asList(
          createMedicine("Paracetamol", "500 مجم", "مرتين في اليوم", 7, "تناول بعد الأكل"),
          createMedicine("Amoxicillin", "500 مجم", "ثلاث مرات في اليوم", 7, "تناول قبل الأكل"),
          createMedicine("Ibuprofen", "400 مجم", "ثلاث مرات في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Metronidazole", "500 مجم", "مرتين في اليوم", 7, "تجنب الكحول أثناء العلاج"),
          createMedicine("Clindamycin", "300 مجم", "أربع مرات في اليوم", 7, "تناول مع كوب كامل من الماء"),
          createMedicine("Azithromycin", "500 مجم", "مرة واحدة في اليوم", 3,
              "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
          createMedicine("Naproxen", "500 مجم", "مرتين في اليوم", 5, "تناول مع الطعام أو الحليب"),
          createMedicine("Diclofenac", "50 مجم", "ثلاث مرات في اليوم", 5, "تناول بعد الأكل"),
          createMedicine("Chlorhexidine Mouthwash", "10 مل", "مرتين في اليوم", 14, "مضمض لمدة 30 ثانية ثم ابصق"),
          createMedicine("Ketoprofen", "100 مجم", "مرتين في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Acyclovir", "400 مجم", "خمس مرات في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Dexamethasone", "0.5 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Miconazole Oral Gel", "5 مل", "أربع مرات في اليوم", 14,
              "احتفظ بالجل في الفم لأطول فترة ممكنة قبل البلع"),
          createMedicine("Fluconazole", "150 مجم", "مرة واحدة في الأسبوع", 2, "تناول مع أو بدون طعام"),
          createMedicine("Hydrogen Peroxide Mouthwash", "10 مل", "مرتين في اليوم", 7, "مضمض لمدة 1 دقيقة ثم ابصق"),
          createMedicine("Lidocaine Topical Gel", "كمية صغيرة", "حسب الحاجة", 7, "ضع طبقة رقيقة على المنطقة المصابة"),
          createMedicine("Triamcinolone Dental Paste", "كمية صغيرة", "مرتين في اليوم", 7,
              "ضع طبقة رقيقة على المنطقة المصابة"),
          createMedicine("Acetaminophen with Codeine", "300/30 مجم", "كل 6 ساعات حسب الحاجة", 3, "تناول بعد الأكل"),
          createMedicine("Erythromycin", "250 مجم", "أربع مرات في اليوم", 7,
              "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
          createMedicine("Cefalexin", "500 مجم", "ثلاث مرات في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Doxycycline", "100 مجم", "مرة واحدة في اليوم", 7, "تناول مع كوب كامل من الماء"),
          createMedicine("Mefenamic Acid", "500 مجم", "ثلاث مرات في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Prednisolone", "5 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"),
          createMedicine("Nystatin Oral Suspension", "5 مل", "أربع مرات في اليوم", 14,
              "احتفظ بالسائل في الفم لأطول فترة ممكنة قبل البلع"),
          createMedicine("Benzydamine Mouthwash", "15 مل", "مرتين في اليوم", 7, "مضمض لمدة 30 ثانية ثم ابصق"),
          createMedicine("Carbamazepine", "200 مجم", "مرتين في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Gabapentin", "300 مجم", "ثلاث مرات في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Morphine Sulfate", "10 مجم", "كل 4 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
          createMedicine("Oxycodone", "5 مجم", "كل 6 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
          createMedicine("Tramadol", "50 مجم", "كل 6 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
          createMedicine("Fentanyl Patch", "25 ميكروغرام/ساعة", "كل 72 ساعة", 9, "ضع اللاصقة على جلد نظيف وجاف"),
          createMedicine("Methadone", "5 مجم", "كل 8 ساعات", 7, "تناول مع أو بدون طعام"),
          createMedicine("Hydrocodone with Acetaminophen", "5/325 مجم", "كل 6 ساعات حسب الحاجة", 3,
              "تناول مع أو بدون طعام"),
          createMedicine("Penicillin V", "500 مجم", "أربع مرات في اليوم", 10,
              "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
          createMedicine("Ciprofloxacin", "500 مجم", "مرتين في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Levofloxacin", "500 مجم", "مرة واحدة في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Moxifloxacin", "400 مجم", "مرة واحدة في اليوم", 7, "تناول مع أو بدون طعام"),
          createMedicine("Vancomycin", "125 مجم", "أربع مرات في اليوم", 10, "تناول مع أو بدون طعام"),
          createMedicine("Linezolid", "600 مجم", "مرتين في اليوم", 10, "تناول مع أو بدون طعام"),
          createMedicine("Gentamicin", "80 مجم", "ثلاث مرات في اليوم", 7, "يُعطى عن طريق الحقن"),
          createMedicine("Amphotericin B Oral Suspension", "100 مجم/مل", "أربع مرات في اليوم", 14,
              "احتفظ بالسائل في الفم لأطول فترة ممكنة قبل البلع"));
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

}
