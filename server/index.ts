import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json())
app.use(cors({origin:"http://localhost:5173"}));

//now nodemailer transporter 

const transproter = nodemailer.createTransport({
    service:"gmail",
    auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS}
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
