const express = require("express");
const axios = require("axios");
const unirest = require("unirest");
const router = express.Router();

// M-Pesa STK Push endpoint
router.post("/stk/push", async (req, res) => {
  try {
    const { phone, amnt, category } = req.body;

    // Format phone number (remove leading 0 or +254)
    const formattedPhone = phone.replace(/^(?:\+254|254|0)/, "254");

    // Step 1: Generate Access Token
    const tokenResponse = await new Promise((resolve, reject) => {
      unirest(
        "GET",
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
      )
        .headers({
          Authorization:
            "Basic SmZwanlxSm9xVEdtRVptTWc2d0xHVkRvR0pKU3RXQVA0bEE3QUJWS01BMUFlQ0NYOmtta3FPNE50QURDblNJNzRFWjRxUHVXeWNzUkxNNENHZXBZRkFYZzZHSElQU1RiTXVuYWdXaFpkWUhRR25wTng=",
        })
        .send()
        .end((res) => {
          if (res.error) reject(res.error);
          resolve(JSON.parse(res.raw_body));
        });
    });

    const accessToken = tokenResponse.access_token;
    console.log("Access Token:", accessToken);

    // Step 2: Prepare STK Push request
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    // const password = Buffer.from(
    //   ${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}
    // ).toString("base64");

    const stkPushRequestData = {
      BusinessShortCode: 174379,
      Password:
        "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQxMTI1MTIxMDUw",
      Timestamp: "20241125121050",
      TransactionType: "CustomerPayBillOnline",
      Amount: amnt,
      PartyA: phone,
      PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
      PhoneNumber: phone,
      CallBackURL: "https://cc0e-197-248-70-47.ngrok-free.app/mpesa/callback",
      AccountReference: `Church X ${category}`,
      TransactionDesc: "Payment of X category",
    };

    // Step 3: Send STK Push request
    const stkPushResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushRequestData,
      {
        headers: {
          Authorization: ` Bearer ${accessToken}`,
        },
      }
    );

    // Step 4: Handle Response
    console.log("STK Push Response:", stkPushResponse.data);

    res.json({
      message: "Payment initiated successfully",
      checkoutRequestId: stkPushResponse.data.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK Push Error:", error);
    res.status(500).json({
      error: "Failed to initiate payment",
      details: error.message || error.response?.data || error,
    });
  }
});

// M-Pesa callback URL
router.post("/mpesa/callback", (req, res) => {
  const callbackData = req.body;

  // Log the data for debugging
  console.log("M-Pesa Callback:", JSON.stringify(callbackData, null, 2));

  // Check transaction result
  if (callbackData.Body.stkCallback.ResultCode === 0) {
    const transactionDetails = callbackData.Body.stkCallback.CallbackMetadata;

    // Process successful transaction
    const amount = transactionDetails.Item.find(
      (item) => item.Name === "Amount"
    ).Value;
    const phoneNumber = transactionDetails.Item.find(
      (item) => item.Name === "PhoneNumber"
    ).Value;

    // Save to database or perform other actions
    console.log(
      `Transaction successful: ${amount} received from ${phoneNumber}`
    );
  } else {
    // Log failure
    console.error(
      "Transaction failed:",
      callbackData.Body.stkCallback.ResultDesc
    );
  }

  // Respond to M-Pesa to confirm receipt of callback
  res.status(200).json({ message: "Callback received successfully" });
});

module.exports = router;
