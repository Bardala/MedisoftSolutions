import { Link } from "react-router-dom";
import "@styles/terms.css";
import { AppRoutes } from "@/app/constants";

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms and Conditions of Use</h1>
      <p className="terms-date">
        <strong>Last Updated:</strong> {currentDate}
      </p>

      <div className="terms-content">
        <section>
          <h4>1. Acceptance of Terms</h4>
          <p>
            By accessing or using Medisoft-Solutions, you agree to be bound by
            these Terms and Conditions ("Terms"). If you do not agree, please
            discontinue use immediately.
          </p>
        </section>

        <section>
          <h4>2. Trial Period</h4>
          <p>
            2.1 The 30-day free trial provides full access to the Monthly Pro
            Plan features.
          </p>
          <p>2.2 No credit card is required to start the trial.</p>
          <p>
            2.3 At trial end, your account will automatically convert to a paid
            Monthly Pro subscription (300 L.E/month) unless you downgrade or
            cancel.
          </p>
        </section>

        <section>
          <h4>3. Subscription Plans</h4>
          <p>3.1 Available plans:</p>
          <ul>
            <li>Basic Plan: 100 L.E/month</li>
            <li>Monthly Pro Plan: 300 L.E/month</li>
          </ul>
          <p>
            3.2 You may upgrade/downgrade at any time through your account
            dashboard.
          </p>
        </section>

        <section>
          <h4>4. Payments</h4>
          <p>4.1 Payments are billed monthly in advance.</p>
          <p>
            4.2 All fees are non-refundable except as required by Egyptian law.
          </p>
          <p>
            4.3 We may suspend service for unpaid subscriptions after 15 days.
          </p>
        </section>

        <section>
          <h4>5. Data Ownership</h4>
          <p>
            5.1 You retain all rights to patient data entered into the Software.
          </p>
          <p>
            5.2 We will never sell or share your medical data with third
            parties.
          </p>
        </section>

        <section>
          <h4>6. Privacy</h4>
          <p>6.1 Our Privacy Policy governs data collection and use.</p>
          <p>
            6.2 We implement industry-standard security measures but cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h4>7. Medical Disclaimer</h4>
          <p>7.1 This is practice management software, not medical advice.</p>
          <p>7.2 You are responsible for verifying all clinical decisions.</p>
        </section>

        <section>
          <h4>8. Termination</h4>
          <p>8.1 You may cancel anytime via your account settings.</p>
          <p>
            8.2 We reserve the right to terminate accounts for violations of
            these Terms.
          </p>
        </section>

        <section>
          <h4>9. Modifications</h4>
          <p>
            9.1 We may update these Terms with 30 days notice via email or
            in-app notification.
          </p>
          <p>9.2 Continued use constitutes acceptance of modified Terms.</p>
        </section>

        <section>
          <h4>10. Limitation of Liability</h4>
          <p>
            To the maximum extent permitted by Egyptian law, we shall not be
            liable for any indirect, incidental, or consequential damages
            arising from use of the Software.
          </p>
        </section>

        <section>
          <h4>11. Governing Law</h4>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the Arab Republic of Egypt.
          </p>
        </section>

        <section>
          <h4>12. Contact Us</h4>
          <p>For questions about these Terms, contact:</p>
          <p>[Medisoft-Solutions]</p>
          <p>[+201120618782]</p>
          <address>
            {/* <br /> */}
            {/* [Physical Address] */}
            {/* <br />
            [medisoftsolutions@gmail.com] */}
            <br />
          </address>
        </section>
      </div>

      <div className="terms-footer">
        <Link to={AppRoutes.WELCOME_PAGE}>Back to Home</Link>{" "}
        <Link to={AppRoutes.SIGNUP}>Back to Sign up</Link>
      </div>
    </div>
  );
}
