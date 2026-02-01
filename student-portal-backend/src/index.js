// student-portal-backend/src/index.js (or index.js)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.json());

// 👇 CHANGE THIS FROM "/auth" TO "/api/auth"
app.use("/api/auth", authRoutes);

// Test route to verify server is working
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(5000, () => {
  console.log("Server running on PORT 5000");
});
