import {
  Card,
  Statistic,
  Row,
  Col,
  Progress,
  Alert,
  Tag,
  Typography,
  Form,
  Button,
  Input,
  Switch,
} from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useLogin } from "../context/loginContext";
import {
  useGetClinicLimits,
  useGetClinicUsage,
  useUpdateClinicLimits,
} from "../hooks/useClinic";
import { usePatientFileStorageUsage } from "../hooks/usePatient";
import { useGetClinicStaff } from "../hooks/useUser";
import { isSuperAdminRole } from "../types";
import "../styles/clinicLimits.css";

const { Text } = Typography;

export const ClinicLimits = ({ clinicId }: { clinicId: number }) => {
  const { loggedInUser } = useLogin();
  const { data: limits, isLoading: isLimitsLoading } =
    useGetClinicLimits(clinicId);
  const { data: usage, isLoading: isUsageLoading } =
    useGetClinicUsage(clinicId);
  const { data: storageUsage, isLoading: isStorageLoading } =
    usePatientFileStorageUsage(clinicId);
  const { data: staff, isLoading: isStaffLoading } =
    useGetClinicStaff(clinicId);
  const updateLimits = useUpdateClinicLimits();
  const { formatMessage: f } = useIntl();
  const [isEditing, setIsEditing] = useState(false);

  if (isLimitsLoading || isStorageLoading || isUsageLoading || isStaffLoading) {
    return <div>{f({ id: "clinic_limits.loading" })}</div>;
  }

  if (!limits || !usage) {
    return <div>{f({ id: "clinic_limits.not_found" })}</div>;
  }

  const handleSave = async (values) => {
    try {
      await updateLimits.mutateAsync(
        { clinicId, limits: values },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    } catch (error) {
      console.error("Error updating limits:", error);
    }
  };

  const getStatusTag = (value: boolean) => (
    <Tag color={value ? "green" : "red"}>
      {value
        ? f({ id: "clinic_limits.allowed" })
        : f({ id: "clinic_limits.not_allowed" })}
    </Tag>
  );

  const renderUsageBars = () => {
    const visitPercentage =
      limits.maxVisitCount > 0
        ? Math.min(100, (usage.visitCount / limits.maxVisitCount) * 100)
        : 0;

    const patientPercentage =
      limits.maxPatientRecords > 0
        ? Math.min(100, (usage.patientCount / limits.maxPatientRecords) * 100)
        : 0;

    const userPercentage =
      limits.maxUsers > 0
        ? Math.min(100, ((staff?.length || 0) / limits.maxUsers) * 100)
        : 0;

    const storagePercentage =
      limits.maxFileStorageMb > 0
        ? Math.min(100, ((storageUsage || 0) / limits.maxFileStorageMb) * 100)
        : 0;

    return (
      <div className="usage-bars">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={f({ id: "clinic_usage.visits" })}
                value={usage.visitCount}
                suffix={`/ ${limits.maxVisitCount}`}
              />
              <Progress
                percent={visitPercentage}
                status={visitPercentage >= 100 ? "exception" : "normal"}
                showInfo={false}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={f({ id: "clinic_usage.patients" })}
                value={usage.patientCount}
                suffix={`/ ${limits.maxPatientRecords}`}
              />
              <Progress
                percent={patientPercentage}
                status={patientPercentage >= 100 ? "exception" : "normal"}
                showInfo={false}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={f({ id: "clinic_usage.users" })}
                value={staff?.length || 0}
                suffix={`/ ${limits.maxUsers}`}
              />
              <Progress
                percent={userPercentage}
                status={userPercentage >= 100 ? "exception" : "normal"}
                showInfo={false}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={f({ id: "clinic_usage.storage" })}
                value={storageUsage || 0}
                suffix={`/ ${limits.maxFileStorageMb} MB`}
              />
              <Progress
                percent={storagePercentage}
                status={storagePercentage >= 90 ? "exception" : "normal"}
                showInfo={false}
              />
            </Card>
          </Col>
        </Row>

        {storagePercentage >= 90 && (
          <Alert
            message={f({ id: "clinic_limits.storage_warning" })}
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    );
  };

  const renderFeatureToggles = () => (
    <div className="feature-toggles">
      <div className="toggle-item">
        <Text strong>{f({ id: "clinic_limits.allow_file_upload" })}:</Text>
        {getStatusTag(limits.allowFileUpload)}
      </div>
      <div className="toggle-item">
        <Text strong>
          {f({ id: "clinic_limits.allow_multiple_branches" })}:
        </Text>
        {getStatusTag(limits.allowMultipleBranches)}
      </div>
      <div className="toggle-item">
        <Text strong>{f({ id: "clinic_limits.allow_billing_feature" })}:</Text>
        {getStatusTag(limits.allowBillingFeature)}
      </div>
    </div>
  );

  const renderEditor = () => (
    <Form layout="vertical" initialValues={limits} onFinish={handleSave}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="maxUsers"
            label={f({ id: "clinic_limits.max_users" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="maxFileStorageMb"
            label={f({ id: "clinic_limits.max_storage" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="maxPatientRecords"
            label={f({ id: "clinic_limits.max_patients" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="maxVisitCount"
            label={f({ id: "clinic_limits.max_visits" })}
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="allowFileUpload"
            label={f({ id: "clinic_limits.allow_file_upload" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="allowMultipleBranches"
            label={f({ id: "clinic_limits.allow_multiple_branches" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="allowBillingFeature"
            label={f({ id: "clinic_limits.allow_billing_feature" })}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <div className="form-actions">
        <Button onClick={() => setIsEditing(false)}>
          {f({ id: "clinic_limits.cancel_button" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={updateLimits.isLoading}
        >
          {f({ id: "clinic_limits.save_button" })}
        </Button>
      </div>
    </Form>
  );

  return (
    <Card
      className="clinic-usage-limits-card"
      title={f({ id: "clinic_limits.title" })}
      extra={
        isSuperAdminRole(loggedInUser.role) &&
        !isEditing && (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            {f({ id: "clinic_limits.edit_button" })}
          </Button>
        )
      }
    >
      {isEditing ? (
        renderEditor()
      ) : (
        <>
          {renderUsageBars()}
          {renderFeatureToggles()}
        </>
      )}
    </Card>
  );
};
