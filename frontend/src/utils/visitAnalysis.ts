import {
  Payment,
  Visit,
  VisitDentalProcedure,
  VisitMedicine,
  VisitPayment,
} from "../types";
import { VisitAnalysis } from "../types";

export function analyzeVisits(
  visits: Visit[],
  visitDentalProcedures: VisitDentalProcedure[],
  visitPayments: VisitPayment[],
  visitMedicines: VisitMedicine[],
): VisitAnalysis[] {
  return visits.map((visit) => {
    const procedures = visitDentalProcedures
      ?.filter((vdp) => vdp.visit.id === visit.id)
      ?.map((vdp) => vdp.dentalProcedure);

    const payments = visitPayments
      ?.filter((vp) => vp.visit.id === visit.id)
      ?.map((vp) => vp.payment);

    const medicines = visitMedicines
      ?.filter((vm) => vm.visit.id === visit.id)
      ?.map((vm) => vm.medicine);

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
  const linkedPaymentIds = new Set(visitPayments.map((vp) => vp.payment.id));

  return payments.filter((payment) => !linkedPaymentIds.has(payment.id));
}
