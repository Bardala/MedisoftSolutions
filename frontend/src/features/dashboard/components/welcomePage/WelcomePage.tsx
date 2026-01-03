import React, { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/welcomePage/index.css";
import { AppRoutes } from "@/app/constants";
import { useLogin } from "@/app";
import { isSuperAdminRole } from "@/shared";
import { useIntl } from "react-intl";
import { ENDPOINT, getFetchFn } from "@/core/api";

import Header from "./Header";
import HeroSection from "./HeroSection";
import FeaturesCarousel from "./FeaturesCarousel";
import AdvancedFeatures from "./AdvancedFeatures";
import CTASection from "./CTASection";
import Footer from "./Footer";
import AnimatedBackground from "./AnimatedBackground";
import {
  enFeatures,
  arFeatures,
  enAdvancedFeatures,
  arAdvancedFeatures,
} from "./featuresData";

export const WelcomePage: FC = () => {
  const navigate = useNavigate();
  const { loggedInUser, login } = useLogin();
  const { locale } = useIntl();
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

  // Warm up serverless backend on page load
  useEffect(() => {
    const warmupBackend = async () => {
      try {
        await getFetchFn<null, string>(ENDPOINT.HEALTHZ);
        console.log("Backend warmed up successfully");
      } catch (error) {
        console.warn(
          "Backend warmup request failed (expected for serverless):",
          error,
        );
      }
    };

    warmupBackend();
  }, []);

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
  const features = isRTL ? arFeatures : enFeatures;
  const advancedFeatures = isRTL ? arAdvancedFeatures : enAdvancedFeatures;

  return (
    <div className="welcome-container" dir={isRTL ? "rtl" : "ltr"}>
      <AnimatedBackground
        scrollProgress={scrollProgress}
        mousePosition={mousePosition}
      />

      <Header onDemoLogin={handleDemoLogin} isLoggingInDemo={isLoggingInDemo} />

      <HeroSection scrollProgress={scrollProgress} />

      <FeaturesCarousel
        features={features}
        activeFeature={activeFeature}
        onFeatureChange={setActiveFeature}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />

      <AdvancedFeatures features={advancedFeatures} />

      <CTASection />

      <Footer />
    </div>
  );
};
