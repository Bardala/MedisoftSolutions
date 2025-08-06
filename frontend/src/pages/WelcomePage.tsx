import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/welcomePage.css";
import { programLogoImage } from "../utils";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const features = [
    {
      title: "Patient Management",
      icon: "🧑‍⚕️",
      description:
        "Comprehensive tools for patient registration, visit logging, and queue management with real-time updates.",
      details: [
        "Add new patients with essential details",
        "Record patient visits with timestamps",
        "Track waiting list with real-time updates",
        "Call patients by name with one click",
        "Access complete patient history instantly",
      ],
    },
    {
      title: "Document Management",
      icon: "📁",
      description:
        "Effortlessly handle all patient documents and medical files.",
      details: [
        "Upload patient files (reports, scans, documents)",
        "Organize documents by patient and visit",
        "Quick access to all patient records",
        "Secure cloud storage for all files",
        "No need for physical paperwork",
      ],
    },
    {
      title: "Payment Tracking",
      icon: "💳",
      description:
        "Easily log payments, generate financial reports, and track clinic performance metrics.",
    },
    {
      title: "Appointment Scheduling",
      icon: "📅",
      description:
        "Intuitive booking system to organize and manage patient appointments efficiently.",
    },
    {
      title: "Reporting & Analytics",
      icon: "📊",
      description:
        "Detailed daily and monthly reports to analyze clinic activity and financial trends.",
    },
    {
      title: "Real-Time Notifications",
      icon: "🔔",
      description:
        "Instant alerts for new visits, payments, and bookings to keep staff informed.",
    },
    {
      title: "Smart Prescriptions",
      icon: "💊",
      description:
        "Automated prescription generation with intelligent features.",
      details: [
        "Generate prescriptions automatically",
        "Access medication history instantly",
        "Template system for common prescriptions",
        "Print or email prescriptions directly",
        "Medication interaction warnings",
      ],
    },
    {
      title: "Doctor's Dashboard",
      icon: "👨‍⚕️",
      description: "Everything a doctor needs at their fingertips.",
      details: [
        "View all last visits with one click",
        "Patient history timeline",
        "System remembers all details automatically",
        "Minimal typing required",
        "Customizable quick-access buttons",
      ],
    },
  ];

  return (
    <div className="welcome-container">
      {/* Animated Background */}
      <div className="animated-background"></div>

      {/* Header Section */}
      {/* Header Section */}
      <header className="welcome-header">
        <div className="logo-container">
          <div className="logo-wrapper">
            <img
              src={programLogoImage}
              alt="MediSoft Logo"
              className="program-logo"
            />
            <div className="logo-text">
              <h1 className="logo">MediSoft Solutions</h1>
              <span className="tagline">Your Clinic's Smart Companion</span>
            </div>
          </div>
        </div>

        <nav className="auth-nav">
          <button
            className="auth-btn login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="auth-btn signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Streamline Your Clinic Operations</h2>
          <p className="hero-description">
            MediSoft is a comprehensive clinic management system designed to
            enhance patient care, simplify financial tracking, and boost
            operational efficiency.
          </p>

          <div className="cta-buttons">
            <button className="primary-cta" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button
              className="secondary-cta"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="dashboard-preview">
            {/* This would be an animated SVG or image of the dashboard */}
            <div className="preview-card">
              <div className="preview-header">
                <span>Today's Summary</span>
              </div>
              <div className="preview-stats">
                <div className="stat-item">
                  <span>🆕</span>
                  <span>12 New</span>
                </div>
                <div className="stat-item">
                  <span>💰</span>
                  <span>$3,450</span>
                </div>
                <div className="stat-item">
                  <span>🏥</span>
                  <span>24 Visits</span>
                </div>
                <div className="stat-item">
                  <span>📅</span>
                  <span>8 Bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h3>Key Features</h3>
        <div className="features-container">
          <div className="feature-carousel">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  activeFeature === index ? "active" : ""
                }`}
                onMouseEnter={() => {
                  setActiveFeature(index);
                  setIsHovering(true);
                }}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="feature-details">
            <div className="detail-content">
              <h4>{features[activeFeature].title}</h4>
              <p>{features[activeFeature].description}</p>
              <ul className="feature-benefits">
                {features[activeFeature].details?.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="advanced-features">
        <h3>Why Clinics Love MediSoft</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-badge">✨</div>
            <h4>Zero Paperwork</h4>
            <p>
              Our system remembers everything - no need for repetitive data
              entry
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-badge">📂</div>
            <h4>Complete Document Management</h4>
            <p>Upload and organize all patient files in one secure place</p>
          </div>
          <div className="feature-item">
            <div className="feature-badge">📞</div>
            <h4>Personalized Patient Interaction</h4>
            <p>Call patients by name and access their full history instantly</p>
          </div>
          <div className="feature-item">
            <div className="feature-badge">⏱️</div>
            <h4>Time-Saving Automation</h4>
            <p>
              Automatic prescriptions and visit summaries save hours each week
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-badge">👁️</div>
            <h4>Complete Visibility</h4>
            <p>
              Doctors see all last visits and patient details with one click
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-badge">♿</div>
            <h4>Accessibility Focused</h4>
            <p>Designed for all users with minimal typing requirements</p>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="dashboard-section">
        <h3>Dashboard Overview</h3>
        <div className="dashboard-highlights">
          <div className="highlight-card">
            <div className="highlight-icon">🧑‍⚕️</div>
            <h4>Quick Actions</h4>
            <p>
              Add patients, log visits, record payments, and manage bookings
              with one click
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">📊</div>
            <h4>Summary Cards</h4>
            <p>
              Get a snapshot of your clinic's activity with key metrics at a
              glance
            </p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">⚙️</div>
            <h4>Customization</h4>
            <p>
              Configure system preferences, user roles, and localization options
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h3>Ready to Transform Your Clinic?</h3>
        <p>
          Join hundreds of healthcare professionals who trust MediSoft for their
          practice management needs.
        </p>
        <div className="cta-buttons">
          <button className="primary-cta" onClick={() => navigate("/signup")}>
            Start Free Trial
          </button>
          <button className="secondary-cta" onClick={() => navigate("/login")}>
            Schedule Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <p>
          © {new Date().getFullYear()} MediSoft Clinic Management System. All
          rights reserved.
        </p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
