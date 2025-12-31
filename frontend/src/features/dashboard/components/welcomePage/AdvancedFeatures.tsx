import React from "react";
import { useIntl } from "react-intl";

interface AdvancedFeature {
  icon: string;
  title: string;
  description: string;
}

interface AdvancedFeaturesProps {
  features: AdvancedFeature[];
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({ features }) => {
  const { formatMessage: f } = useIntl();

  return (
    <section className="advanced-section">
      <div className="section-header">
        <h2 className="section-title">{f({ id: "why_clinics_love" })}</h2>
        <p className="section-subtitle">
          {f({ id: "clinics_choose_subtitle" })}
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
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
  );
};

export default AdvancedFeatures;
