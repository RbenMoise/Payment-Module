import React, { useState, useEffect } from "react";

const PaymentCategories = {
  TITHES: "tithes",
  DONATIONS: "donations",
  PLEDGES: "pledges",
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
  error: {
    color: "#ff0000",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#ffe6e6",
    borderRadius: "4px",
  },
  success: {
    color: "#4CAF50",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#e6ffe6",
    borderRadius: "4px",
  },
  qrCode: {
    textAlign: "center",
    marginBottom: "20px",
  },
  qrCodeImage: {
    maxWidth: "200px",
    marginBottom: "10px",
  },
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Church Offering</h2>

        {qrCode && (
          <div style={styles.qrCode}>
            <img
              src={qrCode}
              alt="Payment QR Code"
              style={styles.qrCodeImage}
            />
            <p>Scan to make payment</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Category</label>
            <select
              style={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value={PaymentCategories.TITHES}>Tithes</option>
              <option value={PaymentCategories.DONATIONS}>Donations</option>
              <option value={PaymentCategories.PLEDGES}>Pledges</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Amount (KSH)</label>
            <input
              type="number"
              min="1"
              style={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>M-Pesa Phone Number</label>
            <input
              type="tel"
              style={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="254XXXXXXXXX"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
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
