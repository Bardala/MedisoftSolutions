import { Payment } from "@/shared/types";

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
  const extractedDealAmounts = extractDealAmounts(notes);

  const totalPaid = payments
    ? payments.reduce((acc, payment) => acc + payment.amount, 0)
    : 0;

  if (extractedDealAmounts.length === 0)
    return { remainingBalance: 0, totalPaid, totalDealsAmount: 0 }; // No deals found

  const totalDealsAmount = extractedDealAmounts.reduce(
    (acc, amount) => acc + amount,
    0,
  );
  const remainingBalance = totalDealsAmount - totalPaid;

  return { remainingBalance, totalDealsAmount, totalPaid };
};
