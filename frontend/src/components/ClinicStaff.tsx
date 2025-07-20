import { FC } from "react";
import { useGetClinicStaff } from "../hooks/useUser";
import { dateFormate } from "../utils";
import { useIntl } from "react-intl";

export const ClinicStaff: FC<{ clinicId: number }> = ({ clinicId }) => {
  const { formatMessage: f } = useIntl();
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
                  <p>
                    {f({ id: "username" })} {user.username}
                  </p>
                  <p>
                    {f({ id: "role" })} {user.role}
                  </p>
                  <p>
                    {f({ id: "phone" })} {user.phone || "Not specified"}
                  </p>
                  <p>
                    {f({ id: "createdAt" })} {dateFormate(user.createdAt)}
                  </p>
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
