package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.medicine.MedicineReqDTO;
import clinic.dev.backend.dto.medicine.MedicineResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.exceptions.UnauthorizedAccessException;
import clinic.dev.backend.exceptions.BadRequestException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.VisitMedicineRepo;
import clinic.dev.backend.util.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MedicineService {

  @Autowired
  private MedicineRepo medicineRepo;

  @Autowired
  private VisitMedicineRepo visitMedicineRepo;

  @Autowired
  private AuthContext authContext;

  private Long getClinicId() {
    return authContext.getClinicId();
  }

  @Transactional
  public MedicineResDTO create(MedicineReqDTO req) {
    Medicine medicine = req.toEntity(getClinicId());

    // Check if medicine with same name already exists in this clinic
    if (medicineRepo.existsByMedicineNameAndClinicId(medicine.getMedicineName(), getClinicId())) {
      throw new IllegalArgumentException("Medicine with this name already exists in your clinic");
    }

    return MedicineResDTO.fromEntity(medicineRepo.save(medicine));
  }

  @Transactional
  public MedicineResDTO update(MedicineReqDTO req) {
    Medicine medicine = medicineRepo
        .findByMedicineNameAndClinicId(req.medicineName(), getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Medicine with this name not found"));

    req.updateEntity(medicine);

    // If the method is @Transactional (yours is), you can omit save() because
    // changes are automatically flushed at the end of the transaction:
    return MedicineResDTO.fromEntity(medicine);
  }

  @Transactional
  public void delete(Long id) {
    // Verify the medicine belongs to this clinic
    if (!medicineRepo.existsByIdAndClinicId(id, getClinicId())) {
      throw new UnauthorizedAccessException("Medicine not found in your clinic");
    }

    visitMedicineRepo.deleteByMedicineIdAndClinicId(id, getClinicId());
    medicineRepo.deleteByIdAndClinicId(id, getClinicId());
  }

  public MedicineResDTO getById(Long id) {
    Medicine medicine = medicineRepo
        .findByIdAndClinicId(id, getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found in your clinic"));

    return MedicineResDTO.fromEntity(medicine);
  }

  public List<MedicineResDTO> getAll() {
    return medicineRepo.findAllByClinicId(getClinicId()).stream().map(MedicineResDTO::fromEntity).toList();
  }

  // Additional useful methods
  public List<Medicine> searchByName(String name) {
    return medicineRepo.findByMedicineNameContainingIgnoreCaseAndClinicId(name, getClinicId());
  }

  public List<MedicineResDTO> getMedicinesByIds(List<Long> ids) {
    if (ids == null || ids.isEmpty()) {
      throw new BadRequestException("Medicine IDs cannot be empty");
    }

    List<Medicine> medicines = medicineRepo.findByIdInAndClinicId(ids, authContext.getClinicId());

    if (medicines.size() != ids.size()) {
      Set<Long> foundIds = medicines.stream()
          .map(Medicine::getId)
          .collect(Collectors.toSet());

      List<Long> missingIds = ids.stream()
          .filter(id -> !foundIds.contains(id))
          .collect(Collectors.toList());

      throw new ResourceNotFoundException(
          "Some Medicine not found or not accessible: " + missingIds);
    }

    return medicines.stream()
        .map(MedicineResDTO::fromEntity)
        .collect(Collectors.toList());

  }

  @Transactional
  public void initializeMedicinesForDentals(Long clinicId) {
    List<Medicine> medicines = Arrays.asList(
        createMedicine(clinicId, "Paracetamol", "500 مجم", "مرتين في اليوم", 7, "تناول بعد الأكل"),
        createMedicine(clinicId, "Amoxicillin", "500 مجم", "ثلاث مرات في اليوم", 7, "تناول قبل الأكل"),
        createMedicine(clinicId, "Ibuprofen", "400 مجم", "ثلاث مرات في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Metronidazole", "500 مجم", "مرتين في اليوم", 7, "تجنب الكحول أثناء العلاج"),
        createMedicine(clinicId, "Clindamycin", "300 مجم", "أربع مرات في اليوم", 7, "تناول مع كوب كامل من الماء"),
        createMedicine(clinicId, "Azithromycin", "500 مجم", "مرة واحدة في اليوم", 3,
            "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
        createMedicine(clinicId, "Naproxen", "500 مجم", "مرتين في اليوم", 5, "تناول مع الطعام أو الحليب"),
        createMedicine(clinicId, "Diclofenac", "50 مجم", "ثلاث مرات في اليوم", 5, "تناول بعد الأكل"),
        createMedicine(clinicId, "Chlorhexidine Mouthwash", "10 مل", "مرتين في اليوم", 14,
            "مضمض لمدة 30 ثانية ثم ابصق"),
        createMedicine(clinicId, "Ketoprofen", "100 مجم", "مرتين في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Acyclovir", "400 مجم", "خمس مرات في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Dexamethasone", "0.5 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Miconazole Oral Gel", "5 مل", "أربع مرات في اليوم", 14,
            "احتفظ بالجل في الفم لأطول فترة ممكنة قبل البلع"),
        createMedicine(clinicId, "Fluconazole", "150 مجم", "مرة واحدة في الأسبوع", 2, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Hydrogen Peroxide Mouthwash", "10 مل", "مرتين في اليوم", 7,
            "مضمض لمدة 1 دقيقة ثم ابصق"),
        createMedicine(clinicId, "Lidocaine Topical Gel", "كمية صغيرة", "حسب الحاجة", 7,
            "ضع طبقة رقيقة على المنطقة المصابة"),
        createMedicine(clinicId, "Triamcinolone Dental Paste", "كمية صغيرة", "مرتين في اليوم", 7,
            "ضع طبقة رقيقة على المنطقة المصابة"),
        createMedicine(clinicId, "Acetaminophen with Codeine", "300/30 مجم", "كل 6 ساعات حسب الحاجة", 3,
            "تناول بعد الأكل"),
        createMedicine(clinicId, "Erythromycin", "250 مجم", "أربع مرات في اليوم", 7,
            "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
        createMedicine(clinicId, "Cefalexin", "500 مجم", "ثلاث مرات في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Doxycycline", "100 مجم", "مرة واحدة في اليوم", 7, "تناول مع كوب كامل من الماء"),
        createMedicine(clinicId, "Mefenamic Acid", "500 مجم", "ثلاث مرات في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Prednisolone", "5 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Nystatin Oral Suspension", "5 مل", "أربع مرات في اليوم", 14,
            "احتفظ بالسائل في الفم لأطول فترة ممكنة قبل البلع"),
        createMedicine(clinicId, "Benzydamine Mouthwash", "15 مل", "مرتين في اليوم", 7, "مضمض لمدة 30 ثانية ثم ابصق"),
        createMedicine(clinicId, "Carbamazepine", "200 مجم", "مرتين في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Gabapentin", "300 مجم", "ثلاث مرات في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Morphine Sulfate", "10 مجم", "كل 4 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Oxycodone", "5 مجم", "كل 6 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Tramadol", "50 مجم", "كل 6 ساعات حسب الحاجة", 3, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Fentanyl Patch", "25 ميكروغرام/ساعة", "كل 72 ساعة", 9,
            "ضع اللاصقة على جلد نظيف وجاف"),
        createMedicine(clinicId, "Methadone", "5 مجم", "كل 8 ساعات", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Hydrocodone with Acetaminophen", "5/325 مجم", "كل 6 ساعات حسب الحاجة", 3,
            "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Penicillin V", "500 مجم", "أربع مرات في اليوم", 10,
            "تناول قبل الأكل بساعة أو بعد الأكل بساعتين"),
        createMedicine(clinicId, "Ciprofloxacin", "500 مجم", "مرتين في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Levofloxacin", "500 مجم", "مرة واحدة في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Moxifloxacin", "400 مجم", "مرة واحدة في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Vancomycin", "125 مجم", "أربع مرات في اليوم", 10, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Linezolid", "600 مجم", "مرتين في اليوم", 10, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Gentamicin", "80 مجم", "ثلاث مرات في اليوم", 7, "يُعطى عن طريق الحقن"),
        createMedicine(clinicId, "Amphotericin B Oral Suspension", "100 مجم/مل", "أربع مرات في اليوم", 14,
            "احتفظ بالسائل في الفم لأطول فترة ممكنة قبل البلع"));

    medicineRepo.saveAll(medicines);
  }

  private Medicine createMedicine(Long clinicId, String name, String dosage, String frequency, int duration,
      String instructions) {
    Medicine medicine = new Medicine();
    medicine.setMedicineName(name);
    medicine.setDosage(dosage);
    medicine.setFrequency(frequency);
    medicine.setDuration(duration);
    medicine.setInstructions(instructions);
    medicine.setClinic(new Clinic(clinicId));
    return medicine;
  }
}