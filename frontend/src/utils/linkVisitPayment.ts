import { Visit, Payment } from "../types";

export type VisitWithPayment = Visit & { amountPaid: number };

export const linkVisitsAndPayments = (
  visits: Visit[],
  payments: Payment[],
): { linked: VisitWithPayment[]; unlinkedPayments: Payment[] } => {
  const paymentMap = new Map<number, Payment>();

  // Populate the payment map for fast lookup by patientId
  payments.forEach((payment) => paymentMap.set(payment.patientId, payment));

  const linked: VisitWithPayment[] = [];
  const processedPayments = new Set<number>(); // Track linked payments

  visits.forEach((visit) => {
    const payment = paymentMap.get(visit.patientId);
    if (payment) {
      linked.push({
        ...visit,
        amountPaid: payments
          .filter((p) => p.patientId === visit.patientId)
          .reduce((i, p) => p.amount + i, 0),
      });
      processedPayments.add(payment.patientId);
    } else {
      linked.push({ ...visit, amountPaid: 0 });
    }
  });

  // Find payments not linked to any visit
  const unlinkedPayments = payments.filter(
    (payment) => !processedPayments.has(payment.patientId),
  );

  return { linked, unlinkedPayments };
};
