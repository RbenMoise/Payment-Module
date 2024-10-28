import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QrCodeGenerator() {
  const [inputValue, setInputValue] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const generateQrCode = () => {
    setQrValue(inputValue); // Update the QR code value to the input
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter text to generate QR code"
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      <button onClick={generateQrCode} style={{ marginLeft: "10px" }}>
        Generate QR Code
      </button>
      <div style={{ marginTop: "20px" }}>
        {qrValue && (
          <QRCodeCanvas value={qrValue} size={200} /> // Display the QR code
        )}
      </div>
    </div>
  );
}

export default QrCodeGenerator;
