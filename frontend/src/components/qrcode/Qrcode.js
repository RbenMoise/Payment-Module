import React, { useState } from "react";
import QrScanner from "react-qr-scanner";

function QrReaderComponent() {
  const [data, setData] = useState("No result");

  const handleScan = (result) => {
    if (result) {
      setData(result); // Display scanned data
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      <p>Scanned Data: {data}</p>
    </div>
  );
}

export default QrReaderComponent;
