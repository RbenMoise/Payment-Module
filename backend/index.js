const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const QRCode = require("qrcode");

dotenv.config();
const app = express();

app.use(express.json()); // Middleware to parse JSON

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Endpoint to generate a QR code
app.get("/generate-qrcode", async (req, res) => {
  const url = "https://example.com"; // You can replace this with dynamic data (e.g., user info)

  try {
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    // Send the QR code to the frontend as a data URL
    res.json({ qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.post("/api/mpesa-payment", (req, res) => {
  const { totalAmount, categories } = req.body;

  // Log the request for debugging
  console.log("Received payment request:", totalAmount, categories);

  // Handle payment logic here, like initiating M-Pesa STK push
  // For now, send a mock response
  res.json({ message: "Payment request received successfully!" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => console.log("Error connecting to MongoDB:", error));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
