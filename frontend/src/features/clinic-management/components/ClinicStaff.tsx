import { FC } from "react";
import { useIntl } from "react-intl";
import "@styles/clinicStaff.css";
import { dateFormate } from "@/utils";
import { useGetClinicStaff } from "../hooks";

const ClinicStaff: FC<{ clinicId: number }> = ({ clinicId }) => {
  const { formatMessage: f } = useIntl();
  const { data: staff, isLoading } = useGetClinicStaff(clinicId);

  if (isLoading) return <div className="staff-loading">Loading staff...</div>;
  if (!staff)
    return <div className="staff-error">No staff found for this clinic</div>;

  return (
    <div className="clinic-staff-container">
      <h2 className="clinic-staff-title">
        {f({ id: "clinicStaffTitle", defaultMessage: "Clinic Staff" })}
      </h2>
      {staff.length ? (
        <ul className="staff-list">
          {staff.map((user) => (
            <li key={user.id} className="staff-card">
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="staff-avatar"
                />
              )}
              <div className="staff-details">
                <h4 className="staff-name">{user.name}</h4>
                <p>
                  <strong>{f({ id: "username" })}:</strong> {user.username}
                </p>
                <p>
                  <strong>{f({ id: "role" })}:</strong> {user.role}
                </p>
                <p>
                  <strong>{f({ id: "phone" })}:</strong>{" "}
                  {user.phone ||
                    f({ id: "notSpecified", defaultMessage: "Not specified" })}
                </p>
                <p>
                  <strong>{f({ id: "createdAt" })}:</strong>{" "}
                  {dateFormate(user.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="staff-empty">
          {f({ id: "noStaff", defaultMessage: "No staff members found" })}
        </p>
      )}
    </div>
  );
};

export default ClinicStaff;
