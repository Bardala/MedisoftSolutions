import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ClinicApi } from "../apis";
import { ClinicLimitsReqDTO } from "../dto";

export const UpdateClinicLimits = () => {
  const { id } = useParams();
  const clinicId = Number(id);
  const queryClient = useQueryClient();

  const [limits, setLimits] = useState<ClinicLimitsReqDTO>({
    maxUsers: 10,
    maxFileStorageMb: 500,
    maxPatientRecords: 1000,
    allowFileUpload: true,
    allowMultipleBranches: false,
    allowBillingFeature: true,
  });

  const { mutate } = useMutation(
    (limits: ClinicLimitsReqDTO) => ClinicApi.updateLimits(clinicId, limits),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["clinic-limits", clinicId]);
        alert("Limits updated!");
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setLimits((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSubmit = () => mutate(limits);

  return (
    <div>
      <h2>Update Clinic Limits</h2>
      <label>
        Max Users:{" "}
        <input
          type="number"
          name="maxUsers"
          value={limits.maxUsers}
          onChange={handleChange}
        />
      </label>
      <label>
        Max Storage MB:{" "}
        <input
          type="number"
          name="maxFileStorageMb"
          value={limits.maxFileStorageMb}
          onChange={handleChange}
        />
      </label>
      <label>
        Max Patients:{" "}
        <input
          type="number"
          name="maxPatientRecords"
          value={limits.maxPatientRecords}
          onChange={handleChange}
        />
      </label>
      <label>
        <input
          type="checkbox"
          name="allowFileUpload"
          checked={limits.allowFileUpload}
          onChange={handleChange}
        />{" "}
        Allow File Upload
      </label>
      <label>
        <input
          type="checkbox"
          name="allowMultipleBranches"
          checked={limits.allowMultipleBranches}
          onChange={handleChange}
        />{" "}
        Multiple Branches
      </label>
      <label>
        <input
          type="checkbox"
          name="allowBillingFeature"
          checked={limits.allowBillingFeature}
          onChange={handleChange}
        />{" "}
        Billing Feature
      </label>
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};
