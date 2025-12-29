import { AppRoutes } from "@/app/constants";
import {
  faUserPlus,
  faDollarSign,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import "@styles/quickActions.css";

export const QuickActions = () => {
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <h3>{f({ id: "quick_actions" })}</h3>
      <div className="actions">
        <button
          className="action-btn"
          onClick={() => navigate(AppRoutes.ADD_PATIENT)}
        >
          <FontAwesomeIcon icon={faUserPlus} /> {f({ id: "add_patient" })}
        </button>
        <button
          className="action-btn"
          onClick={() => navigate(AppRoutes.PAYMENTS)}
        >
          <FontAwesomeIcon icon={faDollarSign} />{" "}
          {f({ id: "home.add_payment" })}
        </button>
        <button
          className="action-btn"
          onClick={() => navigate(AppRoutes.RECORD_VISIT)}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> {f({ id: "record_visit" })}
        </button>
        {/* <button
              className="action-btn"
              onClick={() => navigate(AppRoutes.APPOINTMENT_CALENDER)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />{" "}
              {f({ id: "manage_appointments" })}
            </button> */}
      </div>
    </section>
  );
};
