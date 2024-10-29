import React, { useState } from "react";

const OfferingForm = () => {
  const [tithes, setTithes] = useState("");
  const [donations, setDonations] = useState("");
  const [pledges, setPledges] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateTotal = () => {
    setTotalAmount(
      Number(tithes || 0) + Number(donations || 0) + Number(pledges || 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    calculateTotal();

    try {
      const response = await fetch("/api/mpesa-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount,
          categories: { tithes, donations, pledges },
        }),
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message); // Notify user about the payment process
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Tithes:</label>
      <input
        type="number"
        value={tithes}
        onChange={(e) => setTithes(e.target.value)}
      />

      <label>Donations:</label>
      <input
        type="number"
        value={donations}
        onChange={(e) => setDonations(e.target.value)}
      />

      <label>Pledges:</label>
      <input
        type="number"
        value={pledges}
        onChange={(e) => setPledges(e.target.value)}
      />

      <h3>Total Amount: KSH {totalAmount}</h3>
      <button type="submit" onClick={calculateTotal}>
        Pay Now
      </button>
    </form>
  );
};

export default OfferingForm;
