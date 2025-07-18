package clinic.dev.backend.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import clinic.dev.backend.exceptions.BusinessValidationException;
import clinic.dev.backend.exceptions.ResourceNotFoundException;
import clinic.dev.backend.model.Medicine;
import clinic.dev.backend.model.Patient;
import clinic.dev.backend.model.Payment;
import clinic.dev.backend.model.Procedure;
import clinic.dev.backend.model.User;
import clinic.dev.backend.model.Visit;
import clinic.dev.backend.repository.DentalProcedureRepo;
import clinic.dev.backend.repository.MedicineRepo;
import clinic.dev.backend.repository.PatientRepo;
import clinic.dev.backend.repository.PaymentRepo;
import clinic.dev.backend.repository.UserRepo;
import clinic.dev.backend.repository.VisitRepo;
import clinic.dev.backend.util.AuthContext;

@Component
public class EntityValidator {
  @Autowired
  private VisitRepo visitRepo;
  @Autowired
  private MedicineRepo medicineRepo;
  @Autowired
  private AuthContext authContext;
  @Autowired
  private PaymentRepo paymentRepo;
  @Autowired
  private PatientRepo patientRepo;
  @Autowired
  private UserRepo userRepo;
  @Autowired
  private DentalProcedureRepo dentalProcedureRepo;

  public Payment ensurePaymentExists(Long paymentId) {
    return paymentRepo.findByIdAndClinicId(paymentId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
  }

  public Visit ensureVisitExists(Long visitId) {
    return visitRepo.findByIdAndClinicId(visitId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Visit not found"));
  }

  public Medicine ensureMedicineExists(Long medicineId) {
    return medicineRepo.findByIdAndClinicId(medicineId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));
  }

  public Patient ensurePatientExists(Long patientId) {
    return patientRepo.findByIdAndClinicId(patientId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
  }

  public User ensureUserExists(Long userId) {
    return userRepo.findByIdAndClinicId(userId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
  }

  public Procedure ensureDentalProcedureExists(Long procedureId) {
    return dentalProcedureRepo.findByIdAndClinicId(procedureId, authContext.getClinicId())
        .orElseThrow(() -> new ResourceNotFoundException("Dental procedure not found"));
  }

  public Payment validateVisitPayment(Long visitId, Long paymentId) {
    Payment payment = ensurePaymentExists(paymentId);
    Visit visit = ensureVisitExists(visitId);
    if (!payment.getPatient().getId().equals(visit.getPatient().getId())) {
      throw new BusinessValidationException("Payment does not belong to the specified visit");
    }
    return payment;
  }

  public Procedure validateVisitProcedure(Long visitId, Long procedureId) {
    Procedure procedure = ensureDentalProcedureExists(procedureId);
    Visit visit = ensureVisitExists(visitId);
    if (!procedure.getClinic().getId().equals(visit.getClinic().getId())) {
      throw new BusinessValidationException("Procedure and visit doesn't belong to the same clinic");
    }
    return procedure;
  }

  public Medicine validateVisitMedicine(Long visitId, Long medicineId) {
    Medicine medicine = ensureMedicineExists(medicineId);
    Visit visit = ensureVisitExists(visitId);
    if (!medicine.getClinic().getId().equals(visit.getClinic().getId())) {
      throw new BusinessValidationException("Medicine and visit doesn't belong to the same clinic");
    }
    return medicine;
  }
}