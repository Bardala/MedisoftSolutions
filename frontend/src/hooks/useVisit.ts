import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Patient, Visit } from "../types";
import { ApiError } from "../fetch/ApiError";
import { useLogin } from "../context/loginContext";
import { useRecordPayment, useAddVisitPayment } from "./usePayment";
import { useRecordVisitsProcedures } from "./useVisitDentalProcedure";
import { useIntl } from "react-intl";
import { LOCALS } from "../utils";
import { VisitApi, QueueApi } from "../apis";
import { VisitReqDTO, VisitResDTO } from "../dto";

export const useRecordVisit = () => {
  const [doctorNotes, setDoctorNotes] = useState<string>("");
  const queryClient = useQueryClient();

  const createVisitMutation = useMutation<VisitResDTO, ApiError, VisitReqDTO>(
    (newVisit) => VisitApi.create(newVisit),
    {
      onSuccess: (data) => {
        QueueApi.AddPatient({
          doctorId: data.doctorId,
          patientId: data.patientId,
          assistantId: data.assistantId,
        });
        queryClient.invalidateQueries(["visits"]);
      },
    },
  );

  return {
    createVisitMutation,
    doctorNotes,
    setDoctorNotes,
  };
};

export const useAddVisit = () => {
  const { formatMessage: f } = useIntl();

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

  const isLoading =
    createVisitMutation.isLoading ||
    paymentMutation.isLoading ||
    visitPaymentMutation.isLoading;

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert(f({ id: "patient.select" }));
      return null;
    }

    const newVisit: VisitReqDTO = {
      patientId: selectedPatient?.id,
      doctorId:
        loggedInUser?.role === "Doctor"
          ? loggedInUser?.id
          : Number(localStorage.getItem(LOCALS.SELECTED_DOCTOR_ID)),
      ...(loggedInUser.role === "Assistant" && {
        assistantId: loggedInUser.id,
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
          patientId: selectedPatient.id,
          recordedById: loggedInUser.id,
        });

        if (paymentResult.id) {
          await visitPaymentMutation.mutateAsync({
            visitId: visitId,
            paymentId: paymentResult.id,
          });
        }
      }

      // setSuccessMessage("Visit and payment recorded successfully!");
      setSuccessMessage(f({ id: "success" }));
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

      alert(f({ id: "visit.payment.error" }));
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

    isLoading,
  };
};

export const useUpdateVisit = () => {
  const updateVisitMutation = useMutation<VisitResDTO, ApiError, VisitReqDTO>(
    (visit) => VisitApi.update(visit),
  );

  return { updateVisitMutation };
};

export const useDeleteVisit = () => {
  const queryClient = useQueryClient();
  const deleteVisitMutation = useMutation<unknown, ApiError, Visit>(
    (visit) => VisitApi.delete(visit.id),
    {
      onSuccess: (_, visit) => queryClient.invalidateQueries(["visits"]),
    },
  );

  return { deleteVisitMutation };
};

export const useGetVisitBatch = (ids: number[]) => {
  const visitBatchQuery = useQuery<VisitResDTO[], ApiError>(
    ["visits", "batch", ids],
    () => VisitApi.getBatch(ids),
    { enabled: ids.length > 0 },
  );

  return {
    data: visitBatchQuery.data,
    error: visitBatchQuery.error,
    isLoading: visitBatchQuery.isLoading,
    isError: visitBatchQuery.isError,
  };
};

export const useGetDailyVisits = (date: string) => {
  const dailyVisitsQuery = useQuery<VisitResDTO[], ApiError>(
    ["visits", "daily visits", date],
    () => VisitApi.getWorkday(date),
  );

  return { dailyVisitsQuery };
};
