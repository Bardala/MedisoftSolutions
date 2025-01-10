import { FC } from "react";
import "../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { SidebarProps } from "../types";
import { useSidebar } from "../hooks/useSidebar";

const Sidebar: FC<SidebarProps> = ({ loggedInUser, setSelectedOption }) => {
  const dentistImage = "dentist.jpg";
  const assistantImage = "assistant.jpg";

  const { menuItems } = useSidebar(loggedInUser);

  return (
    <div className="sidebar">
      <div className="sidebar-user-photo-container">
        {loggedInUser.role === "Doctor" ? (
          <img src={dentistImage} alt="Doctor" className="sidebar-user-photo" />
        ) : (
          <img
            src={assistantImage}
            alt="Assistant"
            className="sidebar-user-photo"
          />
        )}
      </div>

      <h3 className="sidebar-subtitle">
        Welcome
        <br />
        {loggedInUser.role === "Doctor" ? " Dr." : "Mr."}{" "}
        {loggedInUser.fullName}
      </h3>

      <ul className="sidebar-menu">
        <li className="sidebar-home" onClick={() => setSelectedOption("/")}>
          <FontAwesomeIcon icon={faHome} className="sidebar-home-icon" />
          {/* <span className="sidebar-link">Home</span> */}
        </li>

        {menuItems.map((item, index) => (
          <li
            key={index}
            className="sidebar-item"
            onClick={() => setSelectedOption(item.link)}
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
