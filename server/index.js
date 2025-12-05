import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
    res.json({ message: "API çalışıyor! ✅" });
});

/* ---------- REGISTER ---------- */
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { email, password: hashed }
        });
        res.json({ message: "Registered", user });
    } catch (err) {
        res.status(400).json({ error: "Email already used" });
    }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user });
});

/* ---------- SOCKET.IO ---------- */
io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("sendMessage", async (data) => {
        await prisma.message.create({
            data: { text: data.text, userId: data.userId }
        });

        io.emit("newMessage", data);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));