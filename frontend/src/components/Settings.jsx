import React, { useState } from "react";

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    name: "Dr. Smith",
    email: "dr.smith@example.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSave = () => {
    console.log("Saving account details:", userDetails);
    // Save settings logic
  };

  return (
    <div className="card-container">
      <h2>Settings</h2>
      <input
        type="text"
        name="name"
        value={userDetails.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={userDetails.email}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Settings;
