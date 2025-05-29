import {
  Medicine,
  Payment,
  Procedure,
  Visit,
  VisitAnalysis,
  VisitDentalProcedure,
  VisitMedicine,
  VisitPayment,
} from "../types";

export function analyzeVisits(
  visits: Visit[],
  visitDentalProcedures: VisitDentalProcedure[],
  visitPayments: VisitPayment[],
  visitMedicines: VisitMedicine[],
): VisitAnalysis[] {
  return visits?.map((visit) => {
    const procedures: Procedure[] = visitDentalProcedures
      ?.filter((vdp) => vdp.visitId === visit.id)
      ?.map((vdp) => {
        const procedure: Procedure = {
          id: vdp.procedureId,
          clinicId: vdp.clinicId,
          serviceName: vdp.procedureName,
          arabicName: vdp.procedureArabicName,
          cost: vdp.procedureCost,
          description: vdp.procedureDescription,
        };
        return procedure;
      });

    const payments = visitPayments
      ?.filter((vp) => vp.visitId === visit.id)
      ?.map((vp) => ({
        id: vp.paymentId,
        clinicId: vp.clinicId,
        amount: vp.paymentAmount,
        recordedById: vp.recordedById,
        recordedByName: vp.recordedByName,
        patientId: visit.patientId,
        patientName: vp.patientName,
        createdAt: vp.createdAt,
        patientPhone: vp.patientPhone,
      }));

    const medicines = visitMedicines
      ?.filter((vm) => vm.visitId === visit.id)
      ?.map((vm) => {
        const m: Medicine = {
          id: vm.medicineId,
          clinicId: vm.clinicId,
          medicineName: vm.medicineName,
          dosage: vm.medicineDosage,
          frequency: vm.medicineFrequency,
          duration: vm.medicineDuration,
          instructions: vm.medicineInstruction,
        };
        return m;
      });

    return {
      visit,
      procedures: procedures || [],
      payment: payments?.[0] || null, // Assuming one payment per visit; adjust if otherwise
      medicines: medicines || [],
    };
  });
}

export function findUnlinkedPayments(
  payments: Payment[],
  visitPayments: VisitPayment[],
): Payment[] {
  const linkedPaymentIds = new Set(visitPayments.map((vp) => vp.paymentId));

  return payments.filter((payment) => !linkedPaymentIds.has(payment.id));
}
