import React from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "@/app/constants";
import { useIntl } from "react-intl";

interface HeroSectionProps {
  scrollProgress: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollProgress }) => {
  const navigate = useNavigate();
  const { formatMessage: f } = useIntl();

  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-content">
          <div className="badge">🚀 {f({ id: "badge_new" })}</div>
          <h1 className="hero-title">
            <span className="gradient-text">
              {f({ id: "welcome_title" })}
            </span>
            <div className="typing-cursor" />
          </h1>
          <p className="hero-description">
            {f({ id: "welcome_description" })}
          </p>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
          <div className="hero-actions">
            <button
              className="cta-primary"
              onClick={() => navigate(AppRoutes.SIGNUP)}
            >
              <span>{f({ id: "get_started" })}</span>
              <div className="cta-glow" />
            </button>
            <button
              className="cta-secondary"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>{f({ id: "learn_more" })}</span>
              <div className="arrow-icon">↓</div>
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="screen-frame">
              <div className="screen-content">
                <div className="screen-header">
                  <div className="screen-dots">
                    <div className="dot red" />
                    <div className="dot yellow" />
                    <div className="dot green" />
                  </div>
                  <div className="screen-title">MediSoft Dashboard</div>
                </div>
                <div className="screen-body">
                  <div className="data-row">
                    <div className="data-cell active">
                      <div className="cell-icon">👥</div>
                      <div className="cell-data">24 Active Patients</div>
                    </div>
                    <div className="data-cell">
                      <div className="cell-icon">💰</div>
                      <div className="cell-data">$3,450 Revenue</div>
                    </div>
                  </div>
                  <div className="data-row">
                    <div className="data-cell">
                      <div className="cell-icon">📅</div>
                      <div className="cell-data">8 Appointments</div>
                    </div>
                    <div className="data-cell">
                      <div className="cell-icon">⏰</div>
                      <div className="cell-data">3 Waiting</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="screen-reflection" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
