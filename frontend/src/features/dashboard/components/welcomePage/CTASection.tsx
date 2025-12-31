import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/app/constants";
import { useIntl } from "react-intl";

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <div className="cta-text">
          <h2 className="cta-title">{f({ id: "ready_to_transform" })}</h2>
          <p className="cta-subtitle">{f({ id: "start_journey" })}</p>
        </div>
        <div className="cta-actions">
          <button
            className="cta-button"
            onClick={() => navigate(AppRoutes.SIGNUP)}
          >
            {f({ id: "start_free_trial" })}
            <div className="button-sparkle">✨</div>
          </button>
        </div>
      </div>
      <div className="cta-ornament">⚕️</div>
    </section>
  );
};

export default CTASection;
