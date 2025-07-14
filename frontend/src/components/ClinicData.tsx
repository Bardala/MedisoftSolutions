// import { useGetClinic, useGetClinicLimits } from "../hooks/useClinic";
// import { useGetClinicStaff } from "../hooks/useUser";
// import "../styles/clinicData.css";

// interface ClinicDataProps {
//   clinicId: number;
//   onBack: () => void;
// }

// export const ClinicData = ({ clinicId, onBack }: ClinicDataProps) => {
//   const { data: clinic, isLoading: clinicLoading } = useGetClinic(clinicId);
//   const { data: limits, isLoading: limitsLoading } =
//     useGetClinicLimits(clinicId);
//   const { data: staff, isLoading: staffLoading } = useGetClinicStaff(clinicId);

//   const isLoading = clinicLoading || limitsLoading || staffLoading;

//   return (
//     <div className="clinic-page">
//       {isLoading ? (
//         <div>Loading clinic data...</div>
//       ) : (
//         <>
//           <div className="clinic-header">
//             <button onClick={onBack}>Back to Clinics</button>
//             <h1>{clinic?.name}</h1>
//             {clinic?.logoUrl && (
//               <img
//                 src={clinic.logoUrl}
//                 alt="Clinic Logo"
//                 className="clinic-logo"
//               />
//             )}
//           </div>

//           <div className="clinic-details">
//             <h2>Clinic Information</h2>
//             <div className="detail-item">
//               <span>Address:</span> {clinic?.address || "Not specified"}
//             </div>
//             <div className="detail-item">
//               <span>Phone:</span> {clinic?.phoneNumber || "Not specified"}
//             </div>
//             <div className="detail-item">
//               <span>Email:</span> {clinic?.email || "Not specified"}
//             </div>
//             <div className="detail-item">
//               <span>Working Hours:</span>{" "}
//               {clinic?.workingHours || "Not specified"}
//             </div>
//           </div>

//           <div className="clinic-limits">
//             <h2>Clinic Limits</h2>
//             {limits && (
//               <>
//                 <div className="limit-item">
//                   <span>Max Users:</span> {limits.maxUsers}
//                 </div>
//                 <div className="limit-item">
//                   <span>Max Storage:</span> {limits.maxFileStorageMb} MB
//                 </div>
//                 <div className="limit-item">
//                   <span>Max Patients:</span> {limits.maxPatientRecords}
//                 </div>
//                 <div className="limit-item">
//                   <span>File Upload:</span>{" "}
//                   {limits.allowFileUpload ? "Allowed" : "Not Allowed"}
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="clinic-staff">
//             <h2>Clinic Staff</h2>
//             {staff?.length ? (
//               <ul className="staff-list">
//                 {staff.map((user) => (
//                   <li key={user.id} className="staff-member">
//                     <div className="staff-info">
//                       {user.profilePicture && (
//                         <img
//                           src={user.profilePicture}
//                           alt={user.name}
//                           className="staff-avatar"
//                         />
//                       )}
//                       <div>
//                         <h4>{user.name}</h4>
//                         <p>{user.role}</p>
//                         <p>{user.phone}</p>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No staff members found</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
import { useState } from "react";
import {
  useGetClinic,
  useGetClinicLimits,
  useUpdateClinicLimits,
} from "../hooks/useClinic";
import { useGetClinicStaff } from "../hooks/useUser";
import { Button, Input, Switch, Form } from "antd";
import "../styles/clinicData.css";

interface ClinicDataProps {
  clinicId: number;
  onBack: () => void;
}

export const ClinicData = ({ clinicId, onBack }: ClinicDataProps) => {
  const { data: clinic, isLoading: clinicLoading } = useGetClinic(clinicId);
  const { data: limits, isLoading: limitsLoading } =
    useGetClinicLimits(clinicId);
  const { data: staff, isLoading: staffLoading } = useGetClinicStaff(clinicId);
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [form] = Form.useForm();
  const updateLimits = useUpdateClinicLimits();

  const isLoading = clinicLoading || limitsLoading || staffLoading;

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

      <div className="clinic-limits">
        <div className="limits-header">
          <h2>Clinic Limits</h2>

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
    </div>
  );
};
