package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSearchReq;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicWithOwnerRes;
import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.User;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.ClinicRepo;
import clinic.dev.backend.repository.ClinicSettingsRepo;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.ClinicServiceBase;
import clinic.dev.backend.util.AuthContext;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClinicService implements ClinicServiceBase {

  @Autowired
  private ClinicRepo clinicRepo;

  @Autowired
  private AuthContext authContext;

  @Autowired
  private ClinicSettingsRepo clinicSettingsRepo;

  @Autowired
  private ClinicLimitsRepo clinicLimitsRepo;

  @Autowired
  private UserRepo userRepo;
  @Autowired
  private ClinicLimitsRepo limitsRepo;
  @Autowired
  private PasswordEncoder passwordEncoder;
  @Autowired
  private MedicineRepo medicineRepo;

  @Override
  public List<ClinicResDTO> getAllClinics() {
    return clinicRepo
        .findAll()
        .stream()
        .map(ClinicResDTO::fromEntity)
        .toList();
  }

  // @Override
  // public ClinicResDTO createClinic(ClinicReqDTO request) {
  // Clinic clinic = request.toEntity();

  // return ClinicResDTO.fromEntity(clinicRepo.save(clinic));
  // }

  @Override
  public ClinicResDTO getClinicById(Long id) {
    return ClinicResDTO.fromEntity(clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found")));
  }

  @Override
  public ClinicResDTO getUserClinic() {
    return ClinicResDTO.fromEntity(clinicRepo.findById(authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found")));
  }

  @Override
  @Transactional
  public ClinicResDTO updateClinicById(Long id, ClinicReqDTO request) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));

    request.updateEntity(clinic);
    clinicRepo.save(clinic);

    return ClinicResDTO.fromEntity(clinicRepo.save(clinic));
  }

  @Override
  @Transactional
  public ClinicResDTO updateClinic(ClinicReqDTO request) {
    Long clinicId = authContext.getClinicId();

    return updateClinicById(clinicId, request);
  }

  @Override
  @Transactional
  public void deleteClinic(Long id) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));

    userRepo.deleteAllByClinicId(id);
    clinicSettingsRepo.deleteAllByClinicId(id);
    clinicLimitsRepo.deleteAllByClinicId(id);
    clinicRepo.delete(clinic);
  }

  @Override
  @Transactional
  public ClinicSettingsResDTO updateSettings(ClinicSettingsReqDTO request) {
    Long clinicId = authContext.getClinicId();

    ClinicSettings settings = clinicSettingsRepo.findByClinicId(clinicId)
        .orElseGet(() -> {
          ClinicSettings newSettings = request.toEntity();
          newSettings.setClinic(clinicRepo.getReferenceById(clinicId));
          return newSettings;
        });

    request.updateEntity(settings);
    return ClinicSettingsResDTO.fromEntity(clinicSettingsRepo.save(settings));
  }

  @Override
  @Transactional
  public ClinicLimitsResDTO updateLimits(ClinicLimitsReqDTO request, Long clinicId) {
    ClinicLimits limits = clinicLimitsRepo
        .findByClinicId(clinicId)
        .orElseGet(() -> {
          ClinicLimits newLimits = request.toEntity();
          newLimits.setClinic(clinicRepo.getReferenceById(clinicId));
          return newLimits;
        });

    request.updateEntity(limits);
    return ClinicLimitsResDTO.fromEntity(clinicLimitsRepo.save(limits));
  }

  public ClinicLimitsResDTO getLimits() {
    return ClinicLimitsResDTO
        .fromEntity(clinicLimitsRepo.findByClinicId(authContext.getClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Clinic limits not found")));
  }

  public ClinicLimitsResDTO getLimitsById(Long clinicId) {
    return ClinicLimitsResDTO
        .fromEntity(clinicLimitsRepo.findByClinicId(clinicId)
            .orElseThrow(() -> new ResourceNotFoundException("Clinic limits not found")));
  }

  public ClinicSettingsResDTO getSettings() {
    return ClinicSettingsResDTO
        .fromEntity(clinicSettingsRepo
            .findByClinicId(authContext
                .getClinicId())
            .orElseThrow(
                () -> new ResourceNotFoundException("Clinic settings not found")));
  }

  @Transactional(readOnly = true)
  public Page<ClinicResDTO> searchClinicsByName(String name, int page, int size) {
    return clinicRepo.findByNameContainingIgnoreCase(name, PageRequest.of(page, size))
        .map(ClinicResDTO::fromEntity);
  }

  @Transactional(readOnly = true)
  public Page<ClinicResDTO> searchClinics(ClinicSearchReq req) {
    if (req.name() == null && req.phone() == null && req.email() == null) {
      return clinicRepo.findAll(req.getPageable())
          .map(ClinicResDTO::fromEntity);
    }

    return clinicRepo.searchClinics(
        req.name(),
        req.phone(),
        req.email(),
        req.getPageable()).map(ClinicResDTO::fromEntity);
  }

  @Transactional
  public ClinicWithOwnerRes createClinicWithOwner(
      ClinicReqDTO clinicDto,
      ClinicLimitsReqDTO limitsDto,
      UserReqDTO ownerDto) {

    Clinic clinic = createClinic(clinicDto);
    ClinicLimits limits = createClinicLimits(limitsDto, clinic);
    User owner = createOwner(ownerDto, clinic);
    createDefaultClinicSettings(clinic, owner);
    initializeMedicinesForDentals(clinic.getId());

    return new ClinicWithOwnerRes(clinic, owner, limits);
  }

  @Transactional
  private Clinic createClinic(ClinicReqDTO clinicDto) {
    Clinic clinic = clinicDto.toEntity();
    return clinicRepo.save(clinic);
  }

  @Transactional
  private ClinicLimits createClinicLimits(ClinicLimitsReqDTO limitsDto, Clinic clinic) {
    ClinicLimits limits = limitsDto.toEntity();
    limits.setClinic(clinic);
    return limitsRepo.save(limits);
  }

  @Transactional
  private User createOwner(UserReqDTO ownerDto, Clinic clinic) {
    User owner = ownerDto.toEntity(clinic.getId());
    owner.setPassword(passwordEncoder.encode(owner.getPassword()));
    return userRepo.save(owner);
  }

  @Transactional
  public void createDefaultClinicSettings(Clinic clinic, User owner) {
    ClinicSettings settings = new ClinicSettings();
    settings.setClinic(clinic);
    settings.setDoctorName(owner.getName());
    clinicSettingsRepo.save(settings);
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
