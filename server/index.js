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
const io = new Server(httpServer, { 
  cors: { 
    origin: ["https://uniplan-frontend.onrender.com", "http://localhost:3000"],
    credentials: true 
  } 
});
const prisma = new PrismaClient();

// CORS
app.use(cors({
  origin: ["https://uniplan-frontend.onrender.com", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

/* ---------- AUTH MIDDLEWARE ---------- */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

/* ---------- TEST ROUTE ---------- */
app.get("/", (req, res) => {
    res.json({ message: "API çalışıyor! ✅" });
});

/* ---------- REGISTER ---------- */
app.post("/api/auth/register", async (req, res) => {
    const { email, password, name, full_name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { 
                email, 
                password: hashed,
                name: name || full_name || email.split('@')[0]
            }
        });
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
        res.json({ 
            message: "Registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.name,
                name: user.name
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ error: "Email already used" });
    }
});

/* ---------- LOGIN ---------- */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
        res.json({ 
            token, 
            user: {
                id: user.id,
                email: user.email,
                full_name: user.name
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Login failed" });
    }
});

/* ---------- GET CURRENT USER ---------- */
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    res.json({ 
        user: {
            id: req.user.id,
            email: req.user.email,
            full_name: req.user.name
        }
    });
});

/* ---------- GET MESSAGES ---------- */
app.get("/api/messages", authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            },
            take: 100 // Last 100 messages
        });

        const formatted = messages.map(msg => ({
            id: msg.id,
            content: msg.text,
            sender_id: msg.userId,
            sender_name: msg.user?.name || msg.user?.email || 'Unknown',
            created_at: msg.createdAt
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

/* ---------- SOCKET.IO ---------- */
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data) => {
        try {
            const message = await prisma.message.create({
                data: { 
                    text: data.content,
                    userId: data.sender_id
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true
                        }
                    }
                }
            });

            const formatted = {
                id: message.id,
                content: message.text,
                sender_id: message.userId,
                sender_name: message.user?.name || message.user?.email || 'Unknown',
                created_at: message.createdAt
            };

            io.emit("receive_message", formatted);
        } catch (err) {
            console.error('Message error:', err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));