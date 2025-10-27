// components/PlanSelector.tsx
import { PlanType } from "@/shared/types";
import "@styles/planSelector.css";
import { FaCheck, FaTimes } from "react-icons/fa";

interface PlanFeatures {
  feature: string[];
  inBetween: string[];
  limit: string[];
}

interface Plan {
  type: PlanType | "CUSTOM";
  title: string;
  price: string;
  features: PlanFeatures;
  recommended?: boolean;
  trialEligible?: boolean;
}

const PlanSelector = ({
  selectedPlan,
  onSelect,
  isTrialPeriod,
  daysRemaining = 30,
}: {
  selectedPlan: PlanType | null;
  onSelect: (plan: PlanType) => void;
  isTrialPeriod: boolean;
  daysRemaining?: number;
}) => {
  const plans: Plan[] = [
    {
      type: PlanType.FREE,
      title: "Hobby",
      price: "100 L.E/month",
      features: {
        feature: [
          "Record visits & patients",
          "Daily reports & statistics",
          "Multilingual support",
          "Basic payment tracking",
          "2 accounts for doctor and assistant",
        ],
        inBetween: [
          "Basic appointment scheduling",
          "File uploads (2 per patient)",
          "512 mb storage size",
          "",
        ],
        limit: [
          "Monthly reports",
          "Up to 5 users",
          "Prescription creation",
          "Advanced analytics",
          "Unlimited visits",
          "Unlimited patient records",
          "Advanced reporting",
        ],
      },
    },
    {
      type: PlanType.MONTHLY,
      title: isTrialPeriod ? "Pro (Trial)" : "Pro",
      price: isTrialPeriod ? "Free for 30 days" : "300 L.E/month",
      features: {
        feature: [
          "Record visits & patients",
          "Daily reports & statistics",
          "Multilingual support",
          "Basic payment tracking",
          "Monthly reports",
          "Up to 5 users",
          "Prescription creation",
          "Advanced analytics",
          "Unlimited visits",
          "Unlimited patient records",
          "Advanced reporting",
          "Advanced appointment scheduling",
          "Unlimited File uploads",
          "2024 mb storage size",
        ],
        inBetween: [],
        limit: [],
      },
      recommended: true,
      trialEligible: true,
    },
  ];

  return (
    <div className="plans-container">
      {isTrialPeriod && (
        <div className="trial-banner">
          <h3>Try Monthly Pro Plan FREE for {daysRemaining} days!</h3>
          <p>After trial, continue with Monthly Pro or downgrade to Basic</p>
        </div>
      )}

      <h3 className="plans-title">
        {isTrialPeriod ? "After Trial, Choose Your Plan" : "Choose Your Plan"}
      </h3>

      <div className="plans-grid">
        {plans.map((plan) => {
          const isDisabled = isTrialPeriod && !plan.trialEligible;

          return (
            <div
              key={plan.type}
              className={`plan-card 
                ${plan.recommended ? "recommended" : ""} 
                ${selectedPlan === plan.type ? "selected" : ""}
                ${isDisabled ? "disabled-plan" : ""}`}
              onClick={() =>
                !isDisabled &&
                plan.type !== "CUSTOM" &&
                onSelect(plan.type as PlanType)
              }
            >
              {plan.recommended && !isTrialPeriod && (
                <div className="recommended-badge">Recommended</div>
              )}

              {isTrialPeriod && plan.trialEligible && (
                <div className="trial-badge">Free Trial</div>
              )}

              <h4 className="plan-title">{plan.title}</h4>
              <p className="plan-price">{plan.price}</p>

              <div className="plan-features">
                <h5>Features:</h5>
                <ul className="features-list">
                  {/* Render feature items with check marks */}
                  {plan.features.feature.map((feature, index) => (
                    <li key={`feature-${index}`} className="plan-feature">
                      <FaCheck className="feature-check" />
                      <span>{feature}</span>
                    </li>
                  ))}

                  {/* Render inBetween items with neutral styling */}
                  {plan.features.inBetween.map((feature, index) => (
                    <li key={`inBetween-${index}`} className="plan-inBetween">
                      <span>{feature}</span>
                    </li>
                  ))}

                  {/* Render limit items with cross marks */}
                  {plan.features.limit.map((feature, index) => (
                    <li key={`limit-${index}`} className="plan-limit">
                      <FaTimes className="feature-cross" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isDisabled ? (
                <div className="trial-overlay">
                  Available after trial period
                </div>
              ) : (
                <button
                  className={`select-plan-button ${
                    selectedPlan === plan.type ? "selected" : ""
                  }`}
                  type="button"
                >
                  {selectedPlan === plan.type
                    ? "Selected"
                    : isTrialPeriod && plan.trialEligible
                    ? "Start Free Trial"
                    : "Select Plan"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isTrialPeriod && (
        <div className="trial-terms">
          {isTrialPeriod && (
            <div className="trial-terms">
              <p>
                By signing up, you agree to our terms
                {/* <Link
                  to="/terms"
                  className="text-blue-600 hover:underline"
                  target="_blank" // Opens in new tab
                >
                  terms
                </Link> */}
                {", "}
                No credit card required.
              </p>
              <p>
                After {daysRemaining} days, your trial will automatically
                convert to the Monthly Pro plan at 300 L.E/month unless you
                choose to downgrade.
              </p>
              <p>
                You can upgrade or downgrade your plan at any time based on your
                needs.
              </p>
              <p>Additional features can be added to your plan as needed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanSelector;
