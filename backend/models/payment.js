const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: Number,
  categories: {
    tithes: Number,
    donations: Number,
    pledges: Number,
  },
  paymentDate: Date,
  status: String,
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
