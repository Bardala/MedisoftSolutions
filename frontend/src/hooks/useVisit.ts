import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  isAssistantRole,
  isDoctorRole,
  Patient,
  Payment,
  Visit,
} from "../types";
import { ApiError } from "../fetch/ApiError";
import { useLogin } from "../context/loginContext";
import { useRecordPayment, useAddVisitPayment } from "./usePayment";
import { useRecordVisitsProcedures } from "./useVisitDentalProcedure";
import { useIntl } from "react-intl";
import { LOCALS } from "../utils";
import { VisitApi } from "../apis";
import { VisitReqDTO, VisitResDTO } from "../dto";
import { useAddPatientToQueue } from "./useQueue";

export const useRecordVisit = () => {
  const [doctorNotes, setDoctorNotes] = useState<string>("");
  const queryClient = useQueryClient();

  const createVisitMutation = useMutation<VisitResDTO, ApiError, VisitReqDTO>(
    (newVisit) => VisitApi.create(newVisit),
    {
      onSuccess: (data) => {
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

  const addPatientToQueue = useAddPatientToQueue();
  const { mutation: paymentMutation } = useRecordPayment();
  const { mutation: visitPaymentMutation } = useAddVisitPayment();
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdVisitDetails, setCreatedVisitDetails] = useState<Visit | null>(
    null,
  );
  const [createdPaymentDetails, setCreatedPaymentDetails] =
    useState<Payment | null>(null);

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
      doctorId: isDoctorRole(loggedInUser?.role)
        ? loggedInUser?.id
        : Number(localStorage.getItem(LOCALS.SELECTED_DOCTOR_ID)),
      ...(isAssistantRole(loggedInUser.role) && {
        assistantId: loggedInUser.id,
      }),
      doctorNotes,
      reason,
      ...(scheduledTime && {
        scheduledTime: new Date(scheduledTime),
      }),
    };

    try {
      const visit = await createVisitMutation.mutateAsync(newVisit);
      const visitId = visit?.id;

      await handleRecordVisitProcedures(visitId);

      let paymentResult: Payment = null;
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

      if (visit && scheduledTime.length === 0) {
        await addPatientToQueue.mutateAsync({
          doctorId: visit.doctorId,
          patientId: selectedPatient.id,
          assistantId: visit.assistantId,
        });
      }

      setSuccessMessage(f({ id: "success" }));
      setCreatedVisitDetails(visit);
      setCreatedPaymentDetails(paymentResult || null);

      // Reset states after successful submission
      setSelectedPatient(null);
      setSelectedDentalProcedures([]);
      setPaymentAmount(0);
      setDoctorNotes("");
      setSelectedPatient(null);
      setSelectedDentalProcedures([]);
      setPaymentAmount(0);
      setDoctorNotes("");
      setReason("");
      setScheduledTime("");

      return visit;
    } catch (error) {
      console.error("Error recording visit or payment:", error);

      if (error.message.includes("The combination of doctor id, patient id"))
        console.warn(error.message);
      else alert(f({ id: "visit.payment.error" }));
      return null;
    }
  };

  return {
    setDoctorNotes,
    setPaymentAmount,
    setScheduledTime,
    setReason,
    handlePatientSelect,
    handleSubmit,
    selectedDentalProcedures,
    selectedPatient,
    paymentAmount,
    doctorNotes,
    scheduledTime,
    reason,

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

export const useGetAppointmentsByDay = (date: Date) => {
  const dateString = date.toISOString().split("T")[0];
  const appointmentsQuery = useQuery<VisitResDTO[], ApiError>(
    ["visits", "day", dateString],
    () => VisitApi.getDailyAppointments(dateString),
  );

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    error: appointmentsQuery.error,
  };
};

export const useGetAppointmentsByWeek = (startDate: Date) => {
  const dateString = startDate.toISOString().split("T")[0];
  const appointmentsQuery = useQuery<VisitResDTO[], ApiError>(
    ["visits", "week", dateString],
    () => VisitApi.getWeaklyAppointments(dateString),
  );

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    error: appointmentsQuery.error,
  };
};
