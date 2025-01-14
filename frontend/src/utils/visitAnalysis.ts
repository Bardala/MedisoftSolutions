import {
  Payment,
  Visit,
  VisitDentalProcedure,
  VisitMedicine,
  VisitPayment,
} from "../types";

export interface VisitAnalysis {
  id?: number;
  visitDate?: Date;
  doctorName: string;
  doctorNotes?: string;
  procedures: string[];
  totalPayment: number;
  medicines: string[];
}

export function analyzeVisits(
  visits: Visit[],
  visitDentalProcedures: VisitDentalProcedure[],
  visitPayments: VisitPayment[],
  visitMedicines: VisitMedicine[],
): VisitAnalysis[] {
  return visits.map((visit) => {
    const procedures = visitDentalProcedures
      ?.filter((vdp) => vdp.visit.id === visit.id)
      ?.map((vdp) => vdp.dentalProcedure.serviceName);

    const totalPayment = visitPayments
      ?.filter((vp) => vp.visit.id === visit.id)
      ?.reduce((sum, vp) => sum + vp.payment.amount, 0);

    const medicines = visitMedicines
      ?.filter((vm) => vm.visit.id === visit.id)
      ?.map((vm) => vm.medicine.medicineName);

    return {
      id: visit.id,
      visitDate: visit.visitDate,
      doctorName: visit.doctor.name,
      doctorNotes: visit.doctorNotes || "N/A",
      procedures,
      totalPayment,
      medicines,
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
