import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClipboard,
  faPills,
  faFileAlt,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useLogin } from "../context/loginContext";
import { useIntl } from "react-intl";

interface PatientProfileHeaderProps {
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}

const PatientProfileHeader = ({
  expandedSection,
  setExpandedSection,
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

      {loggedInUser.role === "Doctor" && (
        <>
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
