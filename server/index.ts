import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

// Nodemailer transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // 16-char App Password (not your normal pwd)
  },
});

// optional: verify SMTP on start
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP verify failed:", err.message);
  } else {
    console.log("SMTP ready:", success);
  }
});

// Health check
app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

// Contact endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SMTP_USER}>`, // keep sender = SMTP_USER
      to: process.env.TO_EMAIL || process.env.SMTP_USER,
      replyTo: email, // user email here
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return res.json({ ok: true });
  } catch (err: any) {
    console.error("sendMail error:", err?.message || err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Email failed" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
