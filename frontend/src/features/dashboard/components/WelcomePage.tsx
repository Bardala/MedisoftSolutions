import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/welcomePage.css";
import {
  faMoon,
  faSun,
  faChevronRight,
  faPlay,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppRoutes } from "@/app/constants";
import { programLogoImage } from "@/utils";
import { useTheme } from "@/app/providers";
import { useLogin } from "@/app";
import { isSuperAdminRole } from "@/shared";
import { useIntl } from "react-intl";
import { LanguageContext } from "@/core/localization";

const WelcomePage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { loggedInUser, login } = useLogin();
  const { formatMessage: f, locale } = useIntl();
  const { switchLanguage } = useContext(LanguageContext);
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isLoggingInDemo, setIsLoggingInDemo] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const isRTL = locale === "ar";

  // Navigate to dashboard if user is already authenticated
  useEffect(() => {
    if (loggedInUser) {
      if (isSuperAdminRole(loggedInUser.role)) {
        navigate(AppRoutes.ADMIN_CLINICS, { replace: true });
      } else {
        navigate(AppRoutes.Dashboard, { replace: true });
      }
    }
  }, [loggedInUser, navigate]);

  // Demo login handler
  const handleDemoLogin = async () => {
    setIsLoggingInDemo(true);
    try {
      await login("numberone", "Islam0101");
    } catch (error) {
      console.error("Demo login failed:", error);
    } finally {
      setIsLoggingInDemo(false);
    }
  };

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  // Track scroll progress for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse movement effect for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Features Data
  const enFeatures = [
    {
      title: "Patient Management",
      icon: "🧑‍⚕️",
      color: "#FF6B6B",
      gradient: "linear-gradient(135deg, #c03f3fff, #FF6B6B)",
      description:
        "Comprehensive tools for patient registration and queue management",
      details: [
        "Add new patients with details",
        "Real-time queue updates",
        "Complete patient history",
      ],
    },
    {
      title: "Queue Management",
      icon: "📋",
      color: "#4ECDC4",
      gradient: "linear-gradient(135deg, #289d95ff, #4ECDC4)",
      description: "Smart patient queue management with notifications",
      details: [
        "Visual queue dashboard",
        "Auto-call system",
        "Priority management",
      ],
    },
    {
      title: "Appointments",
      icon: "📅",
      color: "#45B7D1",
      gradient: "linear-gradient(135deg, #2598b7ff, #45B7D1)",
      description: "Intuitive booking and appointment management",
      details: ["Calendar view", "Automated reminders", "Time optimization"],
    },
    {
      title: "Smart Prescriptions",
      icon: "💊",
      color: "#FFEAA7",
      gradient: "linear-gradient(135deg, #a68e2bff, #FFEAA7)",
      description: "Automated prescription generation with AI",
      details: ["Auto prescriptions", "Medication history", "Print & email"],
    },
    {
      title: "Payments",
      icon: "💳",
      color: "#DDA0DD",
      gradient: "linear-gradient(135deg, #DDA0DD, #DDA0DD)",
      description: "Easy payment tracking and invoicing",
      details: [
        "Multiple payment methods",
        "Auto invoices",
        "Revenue analytics",
      ],
    },
  ];

  const enAdvancedFeatures = [
    {
      icon: "✨",
      title: "Zero Paperwork",
      description: "No repetitive data entry needed",
    },
    {
      icon: "📂",
      title: "Document Management",
      description: "Secure cloud storage for all files",
    },
    {
      icon: "📞",
      title: "Personalized Interaction",
      description: "Call patients by name instantly",
    },
    {
      icon: "⏱️",
      title: "Time Saving",
      description: "Save hours each week with automation",
    },
    {
      icon: "👁️",
      title: "Complete Visibility",
      description: "See all details with one click",
    },
    {
      icon: "♿",
      title: "Accessibility",
      description: "Designed for all users",
    },
  ];

  const arFeatures = [
    {
      title: "إدارة المرضى",
      icon: "🧑‍⚕️",
      color: "#FF6B6B",
      gradient: "linear-gradient(135deg, #FF6B6B, #c03f3fff)",
      description: "أدوات شاملة لتسجيل المرضى وإدارة قوائم الانتظار",
      details: [
        "إضافة مرضى جدد مع التفاصيل",
        "تحديثات قائمة الانتظار في الوقت الفعلي",
        "السجل الطبي الكامل للمريض",
      ],
    },
    {
      title: "إدارة قوائم الانتظار",
      icon: "📋",
      color: "#4ECDC4",
      gradient: "linear-gradient(135deg, #4ECDC4, #289d95ff)",
      description: "إدارة ذكية لقوائم انتظار المرضى مع نظام إشعارات",
      details: [
        "لوحة تحكم مرئية لقائمة الانتظار",
        "نظام استدعاء تلقائي",
        "إدارة الأولويات",
      ],
    },
    {
      title: "المواعيد",
      icon: "📅",
      color: "#45B7D1",
      gradient: "linear-gradient(135deg, #45B7D1, #2598b7ff)",
      description: "نظام حجز وإدارة مواعيد بديهي",
      details: ["عرض تقويمي", "تذكيرات آلية", "تحسين الأوقات"],
    },
    {
      title: "الوصفات الذكية",
      icon: "💊",
      color: "#FFEAA7",
      gradient: "linear-gradient(135deg, #FFEAA7, #a68e2bff)",
      description: "إنشاء وصفت طبية تلقائي باستخدام الذكاء الاصطناعي",
      details: ["وصفات تلقائية", "سجل الأدوية", "طباعة وإرسال بريد إلكتروني"],
    },
    {
      title: "المدفوعات",
      icon: "💳",
      color: "#DDA0DD",
      gradient: "linear-gradient(135deg, #DDA0DD, #9b5a9bff)",
      description: "تتبع سهل للمدفوعات وإدارة الفواتير",
      details: ["طرق دفع متعددة", "فواتير آلية", "تحليلات الإيرادات"],
    },
  ];

  const arAdvancedFeatures = [
    {
      icon: "✨",
      title: "لا أوراق",
      description: "لا حاجة لإدخال بيانات متكرر",
    },
    {
      icon: "📂",
      title: "إدارة المستندات",
      description: "تخزين سحابي آمن لجميع الملفات",
    },
    {
      icon: "📞",
      title: "تفاعل شخصي",
      description: "استدعاء المرضى بالاسم فوراً",
    },
    {
      icon: "⏱️",
      title: "توفير الوقت",
      description: "وفر ساعات أسبوعياً مع الأتمتة",
    },
    {
      icon: "👁️",
      title: "رؤية كاملة",
      description: "عرض جميع التفاصيل بنقرة واحدة",
    },
    { icon: "♿", title: "سهولة الوصول", description: "مصمم لجميع المستخدمين" },
  ];

  const features = isRTL ? arFeatures : enFeatures;
  const advancedFeatures = isRTL ? arAdvancedFeatures : enAdvancedFeatures;

  return (
    <div className="welcome-container" dir={isRTL ? "rtl" : "ltr"}>
      {/* Animated Background with Particles */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translateY(${scrollProgress * 0.5}px)`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div
        className="floating-element floating-1"
        style={{
          transform: `translate(${mousePosition.x * 0.1}px, ${
            mousePosition.y * 0.1
          }px)`,
        }}
      >
        🏥
      </div>
      <div
        className="floating-element floating-2"
        style={{
          transform: `translate(${-mousePosition.x * 0.05}px, ${
            -mousePosition.y * 0.05
          }px)`,
        }}
      >
        💊
      </div>
      <div
        className="floating-element floating-3"
        style={{
          transform: `translate(${mousePosition.x * 0.08}px, ${
            mousePosition.y * -0.08
          }px)`,
        }}
      >
        📊
      </div>

      {/* Progress Indicator */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className="glass-header">
        <div className="header-content">
          <div className="logo-animation">
            <div className="logo-pulse" />
            <img src={programLogoImage} alt="MediSoft" className="logo-image" />
          </div>
          <div className="logo-text">
            <h1 className="logo-glow">MediSoft</h1>
            <span className="tagline-slide">{f({ id: "tagline" })}</span>
          </div>
        </div>

        <nav className="nav-buttons">
          <button
            className="nav-btn login-btn"
            onClick={() => navigate(AppRoutes.LOGIN)}
          >
            <span className="btn-text">{f({ id: "login" })}</span>
            <FontAwesomeIcon icon={faChevronRight} className="btn-icon" />
          </button>
          <button
            className="nav-btn signup-btn pulse-animation"
            onClick={() => navigate(AppRoutes.SIGNUP)}
          >
            <span className="btn-text">{f({ id: "signup" })}</span>
            <FontAwesomeIcon icon={faStar} className="btn-icon" />
          </button>
          <button
            className="nav-btn demo-btn"
            onClick={handleDemoLogin}
            disabled={isLoggingInDemo}
          >
            {isLoggingInDemo ? (
              <div className="spinner" />
            ) : (
              <>
                <span className="btn-text">{f({ id: "tryDemo" })}</span>
                <FontAwesomeIcon icon={faPlay} className="btn-icon" />
              </>
            )}
          </button>
          <button
            className="language-btn"
            onClick={() => switchLanguage(locale === "en" ? "ar" : "en")}
            title={
              locale === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"
            }
          >
            {locale === "en" ? "العربية" : "EN"}
          </button>
          <button className="theme-btn" onClick={toggleTheme}>
            <div className="theme-toggle">
              <FontAwesomeIcon
                icon={isDarkMode ? faMoon : faSun}
                className={`theme-icon ${isDarkMode ? "dark" : "light"}`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
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
              {/* <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Clinics Trust Us</div>
              </div> */}
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

      {/* Features Carousel */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">{f({ id: "key_features" })}</h2>
          <p className="section-subtitle">{f({ id: "features_subtitle" })}</p>
        </div>
        <div className="features-carousel">
          <div className="carousel-track">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  activeFeature === index ? "active" : ""
                }`}
                onClick={() => setActiveFeature(index)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                  background: feature.gradient,
                  transform:
                    activeFeature === index ? "scale(1.1)" : "scale(0.9)",
                  opacity: activeFeature === index ? 1 : 0.7,
                }}
              >
                <div className="feature-icon-wrapper">
                  <div
                    className="feature-icon-bg"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <span className="feature-icon">{feature.icon}</span>
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
                <ul className="feature-list">
                  {feature.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
                <div className="feature-indicator" />
              </div>
            ))}
          </div>
          <div className="carousel-controls">
            {features.map((_, index) => (
              <button
                key={index}
                className={`control-dot ${
                  activeFeature === index ? "active" : ""
                }`}
                onClick={() => setActiveFeature(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="advanced-section">
        <div className="section-header">
          <h2 className="section-title">{f({ id: "why_clinics_love" })}</h2>
          <p className="section-subtitle">
            {f({ id: "clinics_choose_subtitle" })}
          </p>
        </div>
        <div className="features-grid">
          {advancedFeatures.map((feature, index) => (
            <div
              key={index}
              className="feature-tile"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="tile-icon">{feature.icon}</div>
              <h3 className="tile-title">{feature.title}</h3>
              <p className="tile-desc">{feature.description}</p>
              <div className="tile-hover" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="glass-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img
              src={programLogoImage}
              alt="MediSoft"
              className="footer-logo-img"
            />
            <div className="footer-logo-text">
              <div className="footer-logo-title">MediSoft</div>
              <div className="footer-tagline">{f({ id: "tagline" })}</div>
            </div>
          </div>
          <div className="footer-links">
            <a href={AppRoutes.TERMS} className="footer-link">
              {f({ id: "terms_of_service" })}
            </a>
            <div className="footer-copyright">
              © {new Date().getFullYear()} {f({ id: "footer_copyright" })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
