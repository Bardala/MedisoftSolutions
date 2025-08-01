package clinic.dev.backend.service.impl;

import clinic.dev.backend.dto.clinic.req.ClinicBillingPlanReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicLimitsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicSearchReq;
import clinic.dev.backend.dto.clinic.req.ClinicSettingsReqDTO;
import clinic.dev.backend.dto.clinic.req.ClinicUsageReqDTO;
import clinic.dev.backend.dto.clinic.req.CreateClinicWithOwnerReq;
import clinic.dev.backend.dto.clinic.res.ClinicBillingPlanResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicLimitsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicSettingsResDTO;
import clinic.dev.backend.dto.clinic.res.ClinicWithOwnerRes;
import clinic.dev.backend.dto.user.UserReqDTO;
import clinic.dev.backend.dto.user.UserResDTO;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Clinic;
import clinic.dev.backend.model.ClinicBillingPlan;
import clinic.dev.backend.model.ClinicLimits;
import clinic.dev.backend.model.ClinicSettings;
import clinic.dev.backend.model.ClinicUsage;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.User;
import clinic.dev.backend.model.enums.PlanType;
import clinic.dev.backend.model.enums.SubscriptionStatus;
import clinic.dev.backend.model.enums.UserRole;
import clinic.dev.backend.repository.ClinicBillingPlanRepo;
import clinic.dev.backend.repository.ClinicLimitsRepo;
import clinic.dev.backend.repository.ClinicRepo;
import clinic.dev.backend.repository.ClinicSettingsRepo;
import clinic.dev.backend.repository.ClinicUsageRepo;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.service.ClinicServiceBase;
import clinic.dev.backend.util.AuthContext;

import java.time.Instant;
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
  @Autowired
  private ClinicUsageRepo clinicUsageRepo;
  @Autowired
  private ClinicBillingPlanRepo clinicBillingPlanRepo;

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
      CreateClinicWithOwnerReq req) {
    Clinic clinic = createClinic(req.clinic());
    ClinicLimits limits = createClinicLimits(req.limits(), clinic);
    createClinicUsage(new ClinicUsageReqDTO(clinic.getId(), 0, 0));
    ClinicBillingPlan plan;

    if (req.plan() == null)
      plan = createClinicBillingPlan(clinic.getId());
    else
      plan = clinicBillingPlanRepo.save(req.plan().toEntity(clinic.getId()));

    User owner = createOwner(req.owner(), clinic);
    createDefaultClinicSettings(clinic, owner);
    initializeMedicinesForDentals(clinic.getId());

    return new ClinicWithOwnerRes(ClinicResDTO.fromEntity(clinic), UserResDTO.fromEntity(owner),
        ClinicLimitsResDTO.fromEntity(limits), ClinicBillingPlanResDTO.fromEntity(plan));
  }

  @Transactional(readOnly = true)
  public ClinicWithOwnerRes getClinicWithOwner(Long id) {
    Clinic clinic = clinicRepo.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Clinic not found"));

    User owner = userRepo.findByClinicIdAndRole(clinic.getId(), UserRole.OWNER);

    ClinicLimits limits = clinicLimitsRepo.findByClinicId(clinic.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Clinic limits not found"));

    ClinicBillingPlan plan = clinicBillingPlanRepo.findByClinicId(clinic.getId());

    return new ClinicWithOwnerRes(ClinicResDTO.fromEntity(clinic), UserResDTO.fromEntity(owner),
        ClinicLimitsResDTO.fromEntity(limits), ClinicBillingPlanResDTO.fromEntity(plan));
  }

  @Transactional
  public void updateClinicBillingPlan(ClinicBillingPlanReqDTO req, Long clinicId) {
    clinicBillingPlanRepo.save(req.toEntity(clinicId));
  }

  public ClinicBillingPlanResDTO getBillingPlan(Long clinicId) {
    return ClinicBillingPlanResDTO.fromEntity(clinicBillingPlanRepo.findByClinicId(clinicId));
  }

  private ClinicBillingPlan createClinicBillingPlan(Long clinicId) {
    ClinicBillingPlanReqDTO planReq = new ClinicBillingPlanReqDTO(PlanType.MONTHLY,
        Instant.now(), null, 0.0, 0.0, 0.0, SubscriptionStatus.ACTIVE, true);

    ClinicBillingPlan billingPlan = planReq.toEntity(clinicId);
    return clinicBillingPlanRepo.save(billingPlan);
  }

  @Transactional
  public ClinicUsage createClinicUsage(ClinicUsageReqDTO req) {
    ClinicUsage clinicUsage = req.toEntity();
    return clinicUsageRepo.save(clinicUsage);
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
            "احتفظ بالسائل في الفم لأطول فترة ممكنة قبل البلع"),

        // Surgical Medicines
        createMedicine(clinicId, "Cefuroxime", "750 مجم", "ثلاث مرات في اليوم", 7, "حقن وريدي"),
        createMedicine(clinicId, "Cefotaxime", "1 جم", "ثلاث مرات في اليوم", 7, "حقن وريدي"),
        createMedicine(clinicId, "Meropenem", "1 جم", "ثلاث مرات في اليوم", 7, "حقن وريدي"),
        createMedicine(clinicId, "Piperacillin-Tazobactam", "4.5 جم", "ثلاث مرات في اليوم", 7, "حقن وريدي"),
        createMedicine(clinicId, "Teicoplanin", "400 مجم", "مرة واحدة في اليوم", 10, "حقن وريدي"),
        createMedicine(clinicId, "Colistin", "2 مليون وحدة", "ثلاث مرات في اليوم", 14, "حقن وريدي"),
        createMedicine(clinicId, "Tigecycline", "50 مجم", "مرتين في اليوم", 7, "حقن وريدي"),
        createMedicine(clinicId, "Daptomycin", "500 مجم", "مرة واحدة في اليوم", 10, "حقن وريدي"),
        createMedicine(clinicId, "Rifampicin", "600 مجم", "مرة واحدة في اليوم", 14, "تناول على معدة فارغة"),
        createMedicine(clinicId, "Isoniazid", "300 مجم", "مرة واحدة في اليوم", 30, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Pyrazinamide", "1.5 جم", "مرة واحدة في اليوم", 30, "تناول مع الطعام"),
        createMedicine(clinicId, "Ethambutol", "1.2 جم", "مرة واحدة في اليوم", 30, "تناول مع الطعام"),
        createMedicine(clinicId, "Streptomycin", "1 جم", "مرة واحدة في اليوم", 30, "حقن عضلي"),
        createMedicine(clinicId, "Capreomycin", "1 جم", "مرة واحدة في اليوم", 30, "حقن عضلي"),
        createMedicine(clinicId, "Amikacin", "500 مجم", "مرة واحدة في اليوم", 10, "حقن وريدي"),
        createMedicine(clinicId, "Tobramycin", "80 مجم", "ثلاث مرات في اليوم", 10, "حقن وريدي"),
        createMedicine(clinicId, "Netilmicin", "150 مجم", "مرتين في اليوم", 10, "حقن وريدي"),
        createMedicine(clinicId, "Clarithromycin", "500 مجم", "مرتين في اليوم", 7, "تناول مع الطعام"),
        createMedicine(clinicId, "Roxithromycin", "150 مجم", "مرتين في اليوم", 7, "تناول قبل الأكل"),
        createMedicine(clinicId, "Telithromycin", "800 مجم", "مرة واحدة في اليوم", 5, "تناول مع الطعام"),
        createMedicine(clinicId, "Fosfomycin", "3 جم", "جرعة واحدة", 1, "تذاب في الماء وتشرب"),
        createMedicine(clinicId, "Nitrofurantoin", "100 مجم", "أربع مرات في اليوم", 7, "تناول مع الطعام"),
        createMedicine(clinicId, "Trimethoprim-Sulfamethoxazole", "160/800 مجم", "مرتين في اليوم", 7,
            "تناول مع كوب ماء"),
        createMedicine(clinicId, "Methenamine Hippurate", "1 جم", "مرتين في اليوم", 7, "تناول مع الطعام"),
        createMedicine(clinicId, "Norfloxacin", "400 مجم", "مرتين في اليوم", 7, "تناول قبل الأكل بساعة"),
        createMedicine(clinicId, "Ofloxacin", "200 مجم", "مرتين في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Gatifloxacin", "400 مجم", "مرة واحدة في اليوم", 7, "تناول مع أو بدون طعام"),
        createMedicine(clinicId, "Sparfloxacin", "200 مجم", "مرة واحدة في اليوم", 7, "تناول بعد الأكل"),
        createMedicine(clinicId, "Gemifloxacin", "320 مجم", "مرة واحدة في اليوم", 7, "تناول مع الطعام"),
        createMedicine(clinicId, "Mupirocin Ointment", "2%", "ثلاث مرات في اليوم", 10, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Fusidic Acid Cream", "2%", "ثلاث مرات في اليوم", 10, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Silver Sulfadiazine Cream", "1%", "مرتين في اليوم", 14, "يوضع على الحروق"),
        createMedicine(clinicId, "Povidone-Iodine Solution", "10%", "حسب الحاجة", 7, "يستخدم للتعقيم الموضعي"),
        createMedicine(clinicId, "Chlorhexidine Gluconate Solution", "4%", "حسب الحاجة", 7, "يستخدم للتعقيم الموضعي"),
        createMedicine(clinicId, "Hydrocortisone Cream", "1%", "مرتين في اليوم", 7, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Betamethasone Cream", "0.1%", "مرتين في اليوم", 7, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Clotrimazole Cream", "1%", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Terbinafine Cream", "1%", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Ketoconazole Cream", "2%", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Econazole Cream", "1%", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Nystatin Cream", "100,000 وحدة/جم", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Miconazole Powder", "2%", "مرتين في اليوم", 14, "ينثر على المنطقة المصابة"),
        createMedicine(clinicId, "Tolnaftate Powder", "1%", "مرتين في اليوم", 14, "ينثر على المنطقة المصابة"),
        createMedicine(clinicId, "Ciclopirox Olamine Cream", "1%", "مرتين في اليوم", 14, "يوضع على المنطقة المصابة"),
        createMedicine(clinicId, "Amorolfine Nail Lacquer", "5%", "مرة واحدة في الأسبوع", 24, "يطلى الظفر المصاب"),
        createMedicine(clinicId, "Caspofungin", "50 مجم", "مرة واحدة في اليوم", 14, "حقن وريدي"),
        createMedicine(clinicId, "Micafungin", "100 مجم", "مرة واحدة في اليوم", 14, "حقن وريدي"),
        createMedicine(clinicId, "Anidulafungin", "100 مجم", "مرة واحدة في اليوم", 14, "حقن وريدي"),
        createMedicine(clinicId, "Flucytosine", "2.5 جم", "أربع مرات في اليوم", 14, "تناول مع الطعام"),
        createMedicine(clinicId, "Voriconazole", "200 مجم", "مرتين في اليوم", 14, "تناول قبل الأكل بساعة"),
        createMedicine(clinicId, "Posaconazole", "300 مجم", "مرة واحدة في اليوم", 14, "تناول مع الطعام"),
        createMedicine(clinicId, "Itraconazole", "200 مجم", "مرتين في اليوم", 14, "تناول مع الطعام"),
        createMedicine(clinicId, "Ketoconazole Tablet", "200 مجم", "مرة واحدة في اليوم", 14, "تناول مع الطعام"),
        createMedicine(clinicId, "Griseofulvin", "500 مجم", "مرة واحدة في اليوم", 28, "تناول مع وجبة دهنية"),

        createMedicine(clinicId, "Cefazolin", "1 جم IV", "مرة واحدة قبل الجراحة", 1, "اذن حقن خلال 60 دقائق قبل الشق"),
        createMedicine(clinicId, "Ampicillin‑Sulbactam", "1.5 جم IV", "مرة واحدة قبل الجراحة", 1, "ابدأ خلال 60 دقائق"),
        createMedicine(clinicId, "Ceftazidime", "2 جم IV", "مرة واحدة", 1, "قبل الجراحة ب60 دقائق"),
        createMedicine(clinicId, "Metoclopramide", "10 ملغ IV/IM", "مرة واحدة", 1, "لمنع الغثيان أثناء الجراحة"),
        createMedicine(clinicId, "Ondansetron", "4 ملغ IV", "مرة واحدة", 1, "لمنع الغثيان والقيء"),
        createMedicine(clinicId, "Ranitidine IV", "50 ملغ IV", "مرة واحدة", 1, "قبل العملية بساعتين"),
        createMedicine(clinicId, "Midazolam", "1–2 ملغ IV", "حسب الحاجة", 1, "تهدئة قبل التخدير"),
        createMedicine(clinicId, "Diazepam", "5 ملغ IV/PO", "مرة واحدة", 1, "تهدئة قبل العملية"),
        createMedicine(clinicId, "Propofol", "200–300 ملغ IV", "مرة واحدة", 1, "للتخدير العام"),
        createMedicine(clinicId, "Ketamine", "1‑2 ملغ/كغ IV", "حسب الحاجة", 1, "للتحريض السريع"),
        createMedicine(clinicId, "Fentanyl IV", "50–100 ميكروغرام", "حسب الحاجة", 1, "مخفف للألم أثناء العملية"),
        createMedicine(clinicId, "Morphine IV", "2–4 ملغ", "حسب الحاجة بعد العملية", 1, "لألم ما بعد الجراحة"),
        createMedicine(clinicId, "Hydromorphone", "1–2 ملغ IV", "حسب الحاجة", 1, "بديل للمورفين"),
        createMedicine(clinicId, "Paracetamol IV", "1 جم IV", "كل 6 ساعات", 1, "لتسكين الألم وخفض الحرارة"),
        createMedicine(clinicId, "Ketorolac", "30 ملغ IV/IM", "مرة واحدة", 1, "مسكن التهاب غير أفيوني"),
        createMedicine(clinicId, "Enoxaparin", "40 ملغ SC", "مرة واحدة يومياً", 7, "منع جلطات الدم بعد الجراحة"),
        createMedicine(clinicId, "Heparin", "5000 UI SC", "مرتين في اليوم", 7, "لمنع التخثر"),
        createMedicine(clinicId, "Warfarin", "5 ملغ PO", "مرة واحدة يومياً", 5, "مراقبة INR خلال المتابعة"),
        createMedicine(clinicId, "Dexmedetomidine", "0.5 ميكروغرام/كغ IV", "حسب الحاجة", 1,
            "مهدئ ومضاد ألم أثناء التخدير"),
        createMedicine(clinicId, "Dexamethasone IV", "8 ملغ IV", "مرة واحدة", 1, "لتقليل الوذمة والغثيان بعد العملية"),
        createMedicine(clinicId, "Mannitol", "0.5‑1 جم/كغ IV", "مرة واحدة", 1,
            "لخفض الضغط داخل الجمجمة أثناء جراحة دماغية"),
        createMedicine(clinicId, "Atropine IV", "0.5 ملغ IV", "حسب الحاجة", 1, "لمنع بطء القلب أثناء التخدير"),
        createMedicine(clinicId, "Neostigmine", "2.5 ملغ IV", "حسب الحاجة", 1,
            "لعكس تأثير مرخّيات العضلات بعد Vecuronium"),
        createMedicine(clinicId, "Glycopyrrolate", "0.4 ملغ IV", "مرة واحدة", 1, "مع Neostigmine لعكس الشلل العضلي"),
        createMedicine(clinicId, "Atracurium", "50 ملغ IV", "حسب الحاجة", 1, "مرخي عضلي أثناء التخدير"),
        createMedicine(clinicId, "Vecuronium", "10 ملغ IV", "حسب الحاجة", 1, "مرخي عضلي أثناء التخدير العام"),
        createMedicine(clinicId, "Rocuronium", "50 ملغ IV", "حسب الحاجة", 1, "مرخي عضلي سريع الفعل"),
        createMedicine(clinicId, "Sugammadex", "2 جم IV", "مرة واحدة", 1, "لعكس الشلل العضلي بسرعة"),
        createMedicine(clinicId, "Tranexamic Acid", "1 جم IV", "مرة واحدة", 1, "لمنع النزف أثناء وبعد العملية"),
        createMedicine(clinicId, "Omeprazole", "40 ملغ IV/PO", "مرة واحدة", 1, "لحماية المعدة أثناء الصيام الجراحي"),
        createMedicine(clinicId, "Pantoprazole IV", "40 ملغ IV", "مرة واحدة", 1, "لحماية المعدة أثناء العملية"),
        createMedicine(clinicId, "Esomeprazole IV", "40 ملغ IV", "مرة واحدة", 1, "حماية المعدة قبل/بعد الجراحة"),
        createMedicine(clinicId, "Clonidine", "75 ميكروغرام PO", "مرة واحدة قبل العملية", 1, "لخفض ضغط الدم والتوتر"),
        createMedicine(clinicId, "Clopidogrel", "75 ملغ PO", "مرة واحدة يومياً", 5,
            "يوقف قبل الجراحة بعدة أيام حسب نوع العملية"),
        createMedicine(clinicId, "Aspirin", "100 ملغ PO", "مرة واحدة يومياً", 5, "يوقف قبل العملية 5‑7 أيام"),
        createMedicine(clinicId, "Bupivacaine", "0.25 % 20 مل", "حسب الحاجة", 1, "حقن موضعي قبل الشق الجراحي"),
        createMedicine(clinicId, "Lidocaine IV", "1 ملغ/كغ IV", "مرة واحدة", 1, "مسكن سريع أثناء العملية"),
        createMedicine(clinicId, "Ephedrine IV", "5 ملغ IV", "حسب الحاجة", 1, "للحفاظ على الضغط أثناء التخدير"),
        createMedicine(clinicId, "Phenylephrine IV", "50 ميكروغرام IV", "حسب الحاجة", 1, "لضبط ضغط الدم عند انخفاضه"),
        createMedicine(clinicId, "Oxytocin", "10 IU IV", "مرة واحدة ثم مضخة", 1, "لتحفيز تقلص الرحم بعد القيصرية"),
        createMedicine(clinicId, "Magnesium Sulfate", "4 جم IV", "مرة واحدة", 1, "لمنع الصرع أثناء الولادة القيصرية"),
        createMedicine(clinicId, "Morphine PCA", "حسب المضخة", "حسب الحاجة", 1, "للألم الحاد بعد العمليات الكبرى"));

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
