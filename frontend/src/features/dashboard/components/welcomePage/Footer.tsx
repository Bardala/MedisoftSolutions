import React from "react";
import { programLogoImage } from "@/utils";
import { AppRoutes } from "@/app/constants";
import { useIntl } from "react-intl";

const Footer: React.FC = () => {
  const { formatMessage: f } = useIntl();

  return (
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
  );
};

export default Footer;
