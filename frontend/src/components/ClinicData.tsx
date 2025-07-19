import { FC, useState } from "react";
import {
  useGetClinic,
  useGetClinicLimits,
  useUpdateClinicLimits,
} from "../hooks/useClinic";
import { useGetClinicStaff } from "../hooks/useUser";
import { Button, Input, Switch, Form } from "antd";
import "../styles/clinicData.css";
import { useLogin } from "../context/loginContext";
import { isSuperAdminRole } from "../types";

interface ClinicDataProps {
  clinicId: number;
  onBack: () => void;
}

export const ClinicData = ({ clinicId, onBack }: ClinicDataProps) => {
  const { data: clinic, isLoading } = useGetClinic(clinicId);

  // const { data: staff, isLoading: staffLoading } = useGetClinicStaff(clinicId);

  // const isLoading = clinicLoading || limitsLoading || staffLoading;

  if (isLoading) return <div>Loading clinic data...</div>;

  return (
    <div className="clinic-page">
      <div className="clinic-header">
        <button onClick={onBack}>Back to Clinics</button>
        <h1>{clinic?.name}</h1>
        {clinic?.logoUrl && (
          <img src={clinic.logoUrl} alt="Clinic Logo" className="clinic-logo" />
        )}
      </div>

      <div className="clinic-details">
        <h2>Clinic Information</h2>
        <div className="detail-item">
          <span>Address:</span> {clinic?.address || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Phone:</span> {clinic?.phoneNumber || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Email:</span> {clinic?.email || "Not specified"}
        </div>
        <div className="detail-item">
          <span>Working Hours:</span> {clinic?.workingHours || "Not specified"}
        </div>
      </div>

      <ClinicLimits clinicId={clinicId} />
      <ClinicStaff clinicId={clinicId} />
    </div>
  );
};

export const ClinicLimits = ({ clinicId }: { clinicId: number }) => {
  const { loggedInUser } = useLogin();
  const { data: limits, isLoading } = useGetClinicLimits(clinicId);
  const [form] = Form.useForm();
  const updateLimits = useUpdateClinicLimits();

  const [isEditingLimits, setIsEditingLimits] = useState(false);
  if (isLoading) return <div>Loading clinic limits...</div>;
  if (!limits) return <div>No limits found for this clinic</div>;
  const handleEditLimits = () => {
    form.setFieldsValue({
      maxUsers: limits?.maxUsers,
      maxFileStorageMb: limits?.maxFileStorageMb,
      maxPatientRecords: limits?.maxPatientRecords,
      allowFileUpload: limits?.allowFileUpload,
      allowMultipleBranches: limits?.allowMultipleBranches,
      allowBillingFeature: limits?.allowBillingFeature,
    });
    setIsEditingLimits(true);
  };

  const handleSaveLimits = async () => {
    try {
      const values = await form.validateFields();
      await updateLimits.mutateAsync(
        { clinicId, limits: values },
        {
          onSuccess: () => {
            window.alert("Clinic limits were successfully updated");
            setIsEditingLimits(false);
          },
          onError: (error) => {
            window.alert(`Update failed: ${error.message}`);
          },
        },
      );
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingLimits(false);
  };
  return (
    <div className="clinic-limits">
      <div className="limits-header">
        <h2>Clinic Limits</h2>

        {isSuperAdminRole(loggedInUser.role) && (
          <>
            {!isEditingLimits ? (
              <Button type="primary" onClick={handleEditLimits}>
                Edit Limits
              </Button>
            ) : (
              <div className="limits-actions">
                <Button onClick={handleCancelEdit}>Cancel</Button>
                <Button
                  type="primary"
                  onClick={handleSaveLimits}
                  loading={updateLimits.isLoading}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {isEditingLimits ? (
        <Form form={form} layout="vertical">
          <Form.Item
            name="maxUsers"
            label="Max Users"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="maxFileStorageMb"
            label="Max Storage (MB)"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="maxPatientRecords"
            label="Max Patients"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="allowFileUpload"
            label="Allow File Upload"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowMultipleBranches"
            label="Allow Multiple Branches"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowBillingFeature"
            label="Allow Billing Feature"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      ) : limits ? (
        <>
          <div className="limit-item">
            <span>Max Users:</span> {limits.maxUsers}
          </div>
          <div className="limit-item">
            <span>Max Storage:</span> {limits.maxFileStorageMb} MB
          </div>
          <div className="limit-item">
            <span>Max Patients:</span> {limits.maxPatientRecords}
          </div>
          <div className="limit-item">
            <span>File Upload:</span>{" "}
            {limits.allowFileUpload ? "Allowed" : "Not Allowed"}
          </div>
          <div className="limit-item">
            <span>Multiple Branches:</span>{" "}
            {limits.allowMultipleBranches ? "Allowed" : "Not Allowed"}
          </div>
          <div className="limit-item">
            <span>Billing Feature:</span>{" "}
            {limits.allowBillingFeature ? "Enabled" : "Disabled"}
          </div>
        </>
      ) : null}
    </div>
  );
};

export const ClinicStaff: FC<{ clinicId: number }> = ({ clinicId }) => {
  const { data: staff, isLoading } = useGetClinicStaff(clinicId);

  if (isLoading) return <div>Loading staff...</div>;
  if (!staff) return <div>No staff found for this clinic</div>;

  return (
    <div className="clinic-staff">
      <h2>Clinic Staff</h2>
      {staff?.length ? (
        <ul className="staff-list">
          {staff.map((user) => (
            <li key={user.id} className="staff-member">
              <div className="staff-info">
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="staff-avatar"
                  />
                )}
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.role}</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No staff members found</p>
      )}
    </div>
  );
};
