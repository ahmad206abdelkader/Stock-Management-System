import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const app = express(); 

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

//https://excalidraw.com/#json=685aiOC3IWa12OxOZaSmb,-1w3o9FzMSwryLxcpFisOg explane code
/////////////////////////////////////
//////////////////////////////////
/////////////////////////////////
///////////////////////////////////
app.get("/api/categories", async (req, res) => {
  const { userId } = req.query; // استلام المعرف من الرابط (Query Param)
  
  if (!userId) {
    return res.status(400).json({ error: "userId is required to fetch data" });
  }

  const cats = await prisma.category.findMany({
    where: { userId: String(userId) }, // فلترة حسب المستخدم
    include: { products: true },
    orderBy: { id: "desc" }
  });

  const result = cats.map(c => {
    const totalValue = c.products.reduce((sum, p) => {
      const price = Number(p.price);
      return sum + price * p.count;
    } , 0);
    return { ...c, totalValue };
  });
  res.json(result);
});

app.post("/api/products", async (req, res) => {
  const { name, price, count = 0, categoryId } = req.body;
  if (!name || price == null || !categoryId)
    return res.status(400).json({ error: "name, price, categoryId required" });

  const product = await prisma.product.create({
    data: { name, price, count, categoryId },
  });
  res.status(201).json(product);
});

app.post("/api/categories", async (req, res) => {
  const { name, userId } = req.body; // استلام userId من Body
  if (!name || !userId) return res.status(400).json({ error: "Name and userId required" });

  try {
    const category = await prisma.category.create({
      data: { name, userId },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category (Maybe name exists for this user)" });
  }
});

app.patch("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, count, categoryId } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { name, price, count, categoryId },
  });
  res.json(product);
});

app.post("/api/products/:id/increment", async (req, res) => {
  const id = Number(req.params.id);
  const { by = 1 } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: { count: { increment: by } },
  });
  res.json(product);
});

app.post("/api/products/:id/decrement", async (req, res) => {
  const id = Number(req.params.id);
  const { by = 1 } = req.body;
  const product = await prisma.$transaction(async (tx) => {
    const cur = await tx.product.findUnique({ where: { id } });
    if (!cur) throw new Error("not found");
    const next = Math.max(0, cur.count - by); // ما ننزل تحت الصفر
    return tx.product.update({ where: { id }, data: { count: next } });
  });
  res.json(product);
});


app.patch("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, count } = req.body;
  
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { 
        name, 
        price: Number(price), 
        count: Number(count) 
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});


////////////////////////////////////////////////

//////////////////////////////////////////////////////


///////////////////////////////////////////////

////////////////////////////////////////
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

app.delete("/api/products/name/:name", async (req, res) => {
  const { name } = req.params;
  await prisma.product.deleteMany({ where: {name: name}});
  res.json({ message: "product delete"});
});

app.delete("/api/categories/name/:name", async (req, res) => {
  const { name } = req.params;
  const { userId } = req.query; // نمرر الـ userId للتأكد

  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    await prisma.category.deleteMany({
      where: { 
        name: name,
        userId: String(userId) // ضمان عدم حذف تصنيف مستخدم آخر بنفس الاسم
      }
    });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
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
