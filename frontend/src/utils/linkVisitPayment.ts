import { Visit, Payment } from "../types";

type VisitWithPayment = Visit & { amountPaid: number };

export const linkVisitsAndPayments = (
  visits: Visit[],
  payments: Payment[],
): { linked: VisitWithPayment[]; unlinkedPayments: Payment[] } => {
  const paymentMap = new Map<number, Payment>();

  // Populate the payment map for fast lookup by patientId
  payments.forEach((payment) => paymentMap.set(payment.patient.id, payment));

  const linked: VisitWithPayment[] = [];
  const processedPayments = new Set<number>(); // Track linked payments

  visits.forEach((visit) => {
    const payment = paymentMap.get(visit.patient.id);
    if (payment) {
      linked.push({ ...visit, amountPaid: payment.amount });
      processedPayments.add(payment.patient.id);
    } else {
      linked.push({ ...visit, amountPaid: 0 });
    }
  });

  // Find payments not linked to any visit
  const unlinkedPayments = payments.filter(
    (payment) => !processedPayments.has(payment.patient.id),
  );

  return { linked, unlinkedPayments };
};
