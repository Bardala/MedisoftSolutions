import { useState } from "react";
import { useLogin } from "../context/loginContext";
import { useGetClinicLimits, useUpdateClinicLimits } from "../hooks/useClinic";
import { isSuperAdminRole } from "../types";
import { Button, Input, Switch, Form } from "antd";
import { useIntl } from "react-intl";

export const ClinicLimits = ({ clinicId }: { clinicId: number }) => {
  const { loggedInUser } = useLogin();
  const { data: limits, isLoading } = useGetClinicLimits(clinicId);
  const [form] = Form.useForm();
  const updateLimits = useUpdateClinicLimits();
  const { formatMessage: f } = useIntl();

  const [isEditingLimits, setIsEditingLimits] = useState(false);

  if (isLoading) return <div>{f({ id: "clinic_limits.loading" })}</div>;
  if (!limits) return <div>{f({ id: "clinic_limits.not_found" })}</div>;

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
            window.alert(f({ id: "clinic_limits.update_success" }));
            setIsEditingLimits(false);
          },
          onError: (error) => {
            window.alert(
              f(
                { id: "clinic_limits.update_error" },
                { errorMessage: error.message },
              ),
            );
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
        <h2>{f({ id: "clinic_limits.title" })}</h2>

        {isSuperAdminRole(loggedInUser.role) && (
          <>
            {!isEditingLimits ? (
              <Button type="primary" onClick={handleEditLimits}>
                {f({ id: "clinic_limits.edit_button" })}
              </Button>
            ) : (
              <div className="limits-actions">
                <Button onClick={handleCancelEdit}>
                  {f({ id: "clinic_limits.cancel_button" })}
                </Button>
                <Button
                  type="primary"
                  onClick={handleSaveLimits}
                  loading={updateLimits.isLoading}
                >
                  {f({ id: "clinic_limits.save_button" })}
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
            label={f({ id: "clinic_limits.max_users" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="maxFileStorageMb"
            label={f({ id: "clinic_limits.max_storage" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="maxPatientRecords"
            label={f({ id: "clinic_limits.max_patients" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="allowFileUpload"
            label={f({ id: "clinic_limits.allow_file_upload" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowMultipleBranches"
            label={f({ id: "clinic_limits.allow_multiple_branches" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowBillingFeature"
            label={f({ id: "clinic_limits.allow_billing_feature" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      ) : limits ? (
        <>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.max_users" })}:</span>{" "}
            {limits.maxUsers}
          </div>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.max_storage" })}:</span>{" "}
            {limits.maxFileStorageMb} MB
          </div>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.max_patients" })}:</span>{" "}
            {limits.maxPatientRecords}
          </div>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.allow_file_upload" })}:</span>{" "}
            {limits.allowFileUpload
              ? f({ id: "clinic_limits.allowed" })
              : f({ id: "clinic_limits.not_allowed" })}
          </div>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.allow_multiple_branches" })}:</span>{" "}
            {limits.allowMultipleBranches
              ? f({ id: "clinic_limits.allowed" })
              : f({ id: "clinic_limits.not_allowed" })}
          </div>
          <div className="limit-item">
            <span>{f({ id: "clinic_limits.allow_billing_feature" })}:</span>{" "}
            {limits.allowBillingFeature
              ? f({ id: "clinic_limits.enabled" })
              : f({ id: "clinic_limits.disabled" })}
          </div>
        </>
      ) : null}
    </div>
  );
};
