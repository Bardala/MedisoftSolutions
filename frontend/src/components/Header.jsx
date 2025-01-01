import React from "react";
import "../styles/header.css";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/loginContext";

const Header = ({ username }) => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header-content">
        <span className="username">Welcome, {username}</span>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
