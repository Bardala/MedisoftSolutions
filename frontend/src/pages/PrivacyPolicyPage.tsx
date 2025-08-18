import { Link } from "react-router-dom";

export const PrivacyPolicyPage = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="terms-container">
      <h2 className="terms-title">Privacy Policy</h2>
      <p className="terms-date">Last updated: {currentDate}</p>

      <div className="terms-content">
        <h4>1. Introduction</h4>
        <p>
          [Your Clinic Name] ("we," "our," or "us") is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our medical
          practice management software.
        </p>

        <h4>2. Information We Collect</h4>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email, phone number,
            clinic details
          </li>
          <li>
            <strong>Medical Data:</strong> Patient records, visit information,
            prescriptions
          </li>
          <li>
            <strong>Usage Data:</strong> How you interact with our software
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, device
            information
          </li>
        </ul>

        <h4>3. How We Use Your Information</h4>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and maintain our service</li>
          <li>Improve and personalize your experience</li>
          <li>Process transactions and send invoices</li>
          <li>Communicate with you</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h4>4. Data Security</h4>
        <p>
          We implement appropriate technical and organizational measures to
          protect your data, including encryption, access controls, and regular
          security audits.
        </p>

        <h4>5. Data Retention</h4>
        <p>
          We retain personal data only as long as necessary to fulfill the
          purposes we collected it for, including legal, accounting, or
          reporting requirements.
        </p>

        <h4>6. Your Rights</h4>
        <p>You have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Request restriction of processing</li>
        </ul>

        <h4>7. Changes to This Policy</h4>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new policy on this page.
        </p>

        <h4>8. Contact Us</h4>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
          <br />
          Email: privacy@yourclinicsoftware.com
          <br />
          Address: [Your Company Address]
        </p>
      </div>

      <div className="terms-footer">
        <Link to="/">Back to Home</Link>
        <Link to="/terms">View Terms of Service</Link>
      </div>
    </div>
  );
};
