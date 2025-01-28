import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  username: string;
  password: string;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ username, password }) => {
  const qrCodeValue = `http://192.168.1.2:3000/login?username=${encodeURIComponent(
    username,
  )}&password=${encodeURIComponent(password)}`;

  return (
    <div>
      <h3>Let the new User scan QR-code to login automatically</h3>
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
