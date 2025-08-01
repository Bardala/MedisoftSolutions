import { FC } from "react";
import "../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { isDoctorRole, SidebarProps } from "../types";
import { useSidebar } from "../hooks/useSidebar";
import { doctorImage, assistantImage } from "../utils";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

const Sidebar: FC<SidebarProps> = ({ loggedInUser }) => {
  const { menuItems } = useSidebar(loggedInUser);
  const { formatMessage: f } = useIntl();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-user-photo-container">
        {isDoctorRole(loggedInUser.role) ? (
          <img src={doctorImage} alt="Doctor" className="sidebar-user-photo" />
        ) : (
          <img
            src={assistantImage}
            alt="Assistant"
            className="sidebar-user-photo"
          />
        )}
      </div>

      <h3 className="sidebar-subtitle">
        {f({ id: "welcome" })}
        <br />
        {loggedInUser.name}
      </h3>

      <ul className="sidebar-menu">
        <li className="sidebar-home" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} className="sidebar-home-icon" />
        </li>

        {menuItems.map((item, index) => (
          <li
            key={index}
            className="sidebar-item"
            onClick={() => navigate(item.link)}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
            <span className="sidebar-link">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
