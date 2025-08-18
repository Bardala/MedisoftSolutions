import { QRCodeSVG } from "qrcode.react";
import { FRONTEND_HOST } from "../utils/HOST";

interface QRCodeProps {
  username: string;
  password: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ username, password }) => {
  const qrCodeValue = `${FRONTEND_HOST}/login?username=${encodeURIComponent(
    username,
  )}&password=${encodeURIComponent(password)}`;

  return (
    <div>
      <h3>Scan QR-code to login automatically</h3>
      <QRCodeSVG
        value={qrCodeValue}
        size={200}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
};

export default QRCodeComponent;
