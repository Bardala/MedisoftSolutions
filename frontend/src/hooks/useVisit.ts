import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AddToQueueApi,
  CreateVisitApi,
  DeleteVisitApi,
  UpdateVisitApi,
} from "../fetch/api";
import {
  CreateVisitRes,
  CreateVisitReq,
  Patient,
  UpdateVisitRes,
  Visit,
  DeleteVisitRes,
} from "../types";
import { ApiError } from "../fetch/ApiError";
import { useLogin } from "../context/loginContext";
import { useRecordPayment, useAddVisitPayment } from "./usePayment";
import { useRecordVisitsProcedures } from "./useVisitDentalProcedure";

export const useRecordVisit = () => {
  const [doctorNotes, setDoctorNotes] = useState<string>("");

  const createVisitMutation = useMutation<
    CreateVisitRes,
    ApiError,
    CreateVisitReq
  >((newVisit) => CreateVisitApi(newVisit), {
    onSuccess: (data) =>
      AddToQueueApi({ doctorId: data.doctor?.id, patientId: data.patient?.id }),
  });

  return {
    createVisitMutation,
    doctorNotes,
    setDoctorNotes,
  };
};

export const useAddVisit = () => {
  const { loggedInUser } = useLogin();
  const { doctorNotes, setDoctorNotes, createVisitMutation } = useRecordVisit();
  const {
    selectedDentalProcedures,
    setSelectedDentalProcedures,
    handleRecordVisitProcedures,
  } = useRecordVisitsProcedures();

  const { mutation: paymentMutation } = useRecordPayment();
  const { mutation: visitPaymentMutation } = useAddVisitPayment();
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdVisitDetails, setCreatedVisitDetails] = useState<{
    visitId: number;
    patientName: string;
    doctorName: string;
    visitDate: string;
    doctorNotes: string;
    // procedures: DentalProcedure[];
  } | null>(null);
  const [createdPaymentDetails, setCreatedPaymentDetails] = useState<{
    paymentId: number;
    amount: number;
  } | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Please select a patient");
      return null;
    }

    const newVisit: CreateVisitReq = {
      patient: { id: selectedPatient?.id },
      doctor: { id: loggedInUser?.role === "Doctor" ? loggedInUser?.id : 1 },
      ...(loggedInUser.role === "Assistant" && {
        assistant: { id: loggedInUser.id },
      }),
      doctorNotes,
    };

    try {
      const visit = await createVisitMutation.mutateAsync(newVisit);
      const visitId = visit?.id;

      await handleRecordVisitProcedures(visitId);

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
        // procedures: selectedDentalProcedures,
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
    // handleDentalProcedureSelect,
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

export const useUpdateVisit = () => {
  const updateVisitMutation = useMutation<UpdateVisitRes, ApiError, Visit>(
    (visit) => UpdateVisitApi(visit),
  );

  return { updateVisitMutation };
};

export const useDeleteVisit = () => {
  const queryClient = useQueryClient();
  const deleteVisitMutation = useMutation<DeleteVisitRes, ApiError, Visit>(
    (visit) => DeleteVisitApi(visit.id),
    { onSuccess: () => queryClient.invalidateQueries(["daily visits"]) },
  );

  return { deleteVisitMutation };
};
