const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Routes
app.use("/mpesa", require("./routes/mpesa"));
app.use("/qr", require("./routes/qr"));

// Define port
const PORT = process.env.PORT || 5000;

// Connect to Database and Start Server
(async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process with failure
  }
})();
