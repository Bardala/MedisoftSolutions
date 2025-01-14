import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateVisitApi, RecordVisitDentalProcedureApi } from "../fetch/api";
import {
  CreateVisitRes,
  recordVisitDentalProcedureRes,
  recordVisitDentalProcedureReq,
  CreateVisitReq,
  DentalProcedure,
  Patient,
} from "../types";
import { ApiError } from "../fetch/ERROR";
import { useLogin } from "../context/loginContext";
import { useRecordPayment, useAddVisitPayment } from "./usePayment";

export const useRecordVisit = () => {
  const queryClient = useQueryClient();
  const [doctorNotes, setDoctorNotes] = useState<string>("");

  const createVisitMutation = useMutation<
    CreateVisitRes,
    ApiError,
    CreateVisitReq
  >((newVisit) => CreateVisitApi(newVisit), {
    onSuccess: () => {
      queryClient.invalidateQueries(["visits"]);
    },
  });

  const recordVisitDentalProcedureMutation = useMutation<
    recordVisitDentalProcedureRes,
    ApiError,
    recordVisitDentalProcedureReq
  >(
    (visitDentalProcedure) =>
      RecordVisitDentalProcedureApi(visitDentalProcedure),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["visitDentalProcedures"]);
      },
    },
  );

  return {
    createVisitMutation,
    recordVisitDentalProcedureMutation,
    doctorNotes,
    setDoctorNotes,
  };
};

export const useAddVisit = () => {
  const { loggedInUser } = useLogin();

  const {
    doctorNotes,
    setDoctorNotes,
    recordVisitDentalProcedureMutation,
    createVisitMutation,
  } = useRecordVisit();

  const { mutation: paymentMutation } = useRecordPayment();
  const { mutation: visitPaymentMutation } = useAddVisitPayment();
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDentalProcedures, setSelectedDentalProcedures] = useState<
    DentalProcedure[]
  >([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdVisitDetails, setCreatedVisitDetails] = useState<{
    visitId: number;
    patientName: string;
    doctorName: string;
    visitDate: string;
    doctorNotes: string;
  } | null>(null);
  const [createdPaymentDetails, setCreatedPaymentDetails] = useState<{
    paymentId: number;
    amount: number;
  } | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleDentalProcedureSelect = (dentalProcedure: DentalProcedure) => {
    setSelectedDentalProcedures((prev) => [...prev, dentalProcedure]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || selectedDentalProcedures.length === 0) {
      alert("Please select a patient and at least one dental procedure.");
      return null;
    }

    const newVisit: CreateVisitReq = {
      patient: { id: selectedPatient?.id },
      doctor: { id: loggedInUser?.id },
      visitDate: new Date(),
      doctorNotes,
    };

    try {
      const visit = await createVisitMutation.mutateAsync(newVisit);
      const visitId = visit.id;

      await Promise.all(
        selectedDentalProcedures.map((dentalProcedure) =>
          recordVisitDentalProcedureMutation.mutateAsync({
            visit: { id: visitId },
            dentalProcedure: { id: dentalProcedure.id },
          }),
        ),
      );
      let paymentResult = null;
      if (paymentAmount > 0) {
        paymentResult = await paymentMutation.mutateAsync({
          amount: paymentAmount,
          patient: { id: selectedPatient.id },
          recordedBy: { id: loggedInUser.id },
        });

        if (paymentResult.id) {
          await visitPaymentMutation.mutateAsync({
            visit: { id: visitId },
            payment: { id: paymentResult.id },
          });
        }
      }

      setSuccessMessage("Visit and payment recorded successfully!");
      setCreatedVisitDetails({
        visitId,
        patientName: selectedPatient.fullName,
        doctorName: loggedInUser.name,
        visitDate: new Date().toLocaleString(),
        doctorNotes,
      });
      setCreatedPaymentDetails(
        paymentResult
          ? {
              paymentId: paymentResult.id,
              amount: paymentAmount,
            }
          : null,
      );

      // Reset states after successful submission
      setSelectedPatient(null);
      setSelectedDentalProcedures([]);
      setPaymentAmount(0);
      setDoctorNotes("");
      // alert("Visit and payment recorded successfully!");

      // Reset states after successful submission
      setSelectedPatient(null);
      setSelectedDentalProcedures([]);
      setPaymentAmount(0);
      setDoctorNotes("");

      return visit;
    } catch (error) {
      console.error("Error recording visit or payment:", error);
      alert("Failed to record visit or payment.");
      return null;
    }
  };

  return {
    setDoctorNotes,
    setPaymentAmount,
    handleDentalProcedureSelect,
    handlePatientSelect,
    handleSubmit,
    selectedDentalProcedures,
    selectedPatient,
    paymentAmount,
    doctorNotes,

    successMessage,
    createdVisitDetails,
    createdPaymentDetails,
  };
};
