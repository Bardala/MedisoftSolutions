import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboard,
  faPills,
  faFileAlt,
  faPrint,
  // faTooth,
} from "@fortawesome/free-solid-svg-icons";
import { useIntl } from "react-intl";
import { useLogin } from "@/app";
import { QueueEntry, isDoctorRole } from "@/shared";

interface PatientProfileHeaderProps {
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
  entry: QueueEntry | null;
}

const PatientProfileHeader = ({
  expandedSection,
  setExpandedSection,
  entry,
}: PatientProfileHeaderProps) => {
  const { loggedInUser } = useLogin();
  const { formatMessage: f } = useIntl();

  return (
    <div className="profile-header">
      <div
        className="icon"
        onClick={() =>
          setExpandedSection(expandedSection === "info" ? null : "info")
        }
      >
        <FontAwesomeIcon icon={faUser} /> <span>{f({ id: "info" })}</span>
      </div>
      <div
        className="icon"
        onClick={() =>
          setExpandedSection(expandedSection === "visits" ? null : "visits")
        }
      >
        <FontAwesomeIcon icon={faClipboard} />{" "}
        <span>{f({ id: "visits" })}</span>
      </div>
      <div
        className="icon"
        onClick={() =>
          setExpandedSection(expandedSection === "files" ? null : "files")
        }
      >
        <FontAwesomeIcon icon={faFileAlt} /> <span>{f({ id: "files" })}</span>
      </div>

      {isDoctorRole(loggedInUser.role) && entry.status !== "WAITING" && (
        <>
          {/* <div
            className="icon"
            onClick={() =>
              setExpandedSection(
                expandedSection === "dentalChart" ? null : "dentalChart",
              )
            }
          >
            <FontAwesomeIcon icon={faTooth} />{" "}
            <span>{f({ id: "dentalChart" })}</span>
          </div> */}

          <div
            className="icon"
            onClick={() =>
              setExpandedSection(
                expandedSection === "medicines" ? null : "medicines",
              )
            }
          >
            <FontAwesomeIcon icon={faPills} />{" "}
            <span>{f({ id: "medicines" })}</span>
          </div>

          <div
            className="icon"
            onClick={() =>
              setExpandedSection(
                expandedSection === "prescriptionPrint"
                  ? null
                  : "prescriptionPrint",
              )
            }
          >
            <FontAwesomeIcon icon={faPrint} /> <span>{f({ id: "print" })}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientProfileHeader;
