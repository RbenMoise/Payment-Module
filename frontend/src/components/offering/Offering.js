import React, { useState, useEffect } from "react";
import "./offering.css";

const PaymentCategories = {
  TITHES: "tithes",
  DONATIONS: "donations",
  PLEDGES: "pledges",
};

const OfferingForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const response = await fetch("/generate-qrcode");
      const data = await response.json();
      setQrCode(data.qrCodeDataUrl);
    } catch (err) {
      setError("Failed to generate QR code");
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex =
      /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-359])|(?:5[789])|(?:6[789])|(?:90))[0-9]{6})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!selectedCategory || !amount || !phoneNumber) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setError("Please enter a valid Kenyan phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/stk/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          amnt: amount,
          category: selectedCategory,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(
          "Payment initiated! Please check your phone for the M-Pesa prompt."
        );
        setSelectedCategory("");
        setAmount("");
        setPhoneNumber("");
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Church Offering</h2>

        {qrCode && (
          <div className="qrCode">
            <img src={qrCode} alt="Payment QR Code" className="qrCodeImage" />
            <p>Scan to make payment</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Payment Category</label>
            <select
              className="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value={PaymentCategories.TITHES}>Tithes</option>
              <option value={PaymentCategories.DONATIONS}>Donations</option>
              <option value={PaymentCategories.PLEDGES}>Pledges</option>
            </select>
          </div>

          <div className="formGroup">
            <label className="label">Amount (KSH)</label>
            <input
              type="number"
              min="1"
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="formGroup">
            <label className="label">M-Pesa Phone Number</label>
            <input
              type="tel"
              className="input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254XXXXXXXXX"
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button
            type="submit"
            className={`button ${loading ? "buttonDisabled" : ""}`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferingForm;
