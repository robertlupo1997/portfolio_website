import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  url: string;
  size?: number;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  url,
  size = 48,
  className = ""
}) => {
  return (
    <div className={`bg-white p-1 border border-black ${className}`}>
      <QRCodeSVG
        value={url}
        size={size - 8}
        level="L"
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
};

export default QRCode;
