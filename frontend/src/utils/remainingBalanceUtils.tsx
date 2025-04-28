// import { Payment } from "../types";

// const extractDealAmount = (notes: string) => {
//   if (!notes) return 0;

//   const match = notes.match(/(?:الاتفاق):\s*(\d+)/);
//   return match ? parseFloat(match[1]) : 0;
// };

// export const calculateRemainingBalance = (
//   notes: string,
//   payments: Payment[],
// ) => {
//   const dealAmount = extractDealAmount(notes);
//   const totalPaid = payments
//     ? payments.reduce(
//         (acc, payment: { amount: number }) => acc + payment.amount,
//         0,
//       )
//     : 0;
//   return dealAmount - totalPaid;
// };

import { Payment } from "../types";

const extractDealAmounts = (notes: string): number[] => {
  if (!notes) return [];

  // Extract all deal amounts from the notes
  const matches = notes.match(/(?:الاتفاق|Deal):\s*(\d+)/g);
  return matches
    ? matches.map((match) => parseFloat(match.replace(/\D/g, "")))
    : [];
};

export const calculateRemainingBalance = (
  notes: string,
  payments: Payment[],
) => {
  const deals = extractDealAmounts(notes);
  if (deals.length === 0) return 0; // No deals found

  const totalPaid = payments
    ? payments.reduce((acc, payment) => acc + payment.amount, 0)
    : 0;

  const totalDeals = deals.reduce((acc, amount) => acc + amount, 0);
  const remainingBalance = totalDeals - totalPaid;

  return remainingBalance;
};
