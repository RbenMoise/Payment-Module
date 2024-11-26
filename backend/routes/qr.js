const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();

router.get("/generate-qrcode", async (req, res) => {
  try {
    const paymentUrl = `${process.env.FRONTEND_URL}/payment`;
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl);
    res.json({ qrCodeDataUrl });
  } catch (error) {
    console.error("QR Code generation error:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;
