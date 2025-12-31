import React from "react";
import { useIntl } from "react-intl";

interface Feature {
  title: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  details: string[];
}

interface FeaturesCarouselProps {
  features: Feature[];
  activeFeature: number;
  onFeatureChange: (index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({
  features,
  activeFeature,
  onFeatureChange,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { formatMessage: f } = useIntl();

  return (
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
              onClick={() => onFeatureChange(index)}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
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
              onClick={() => onFeatureChange(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCarousel;
