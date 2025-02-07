import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server ,io} from "./config/socket.js"

dotenv.config();


const PORT = process.env.PORT;

// Middleware to parse JSON request body
app.use(express.json());

// Middleware to parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.use(cors({
  origin: "*", // Or use '*' to allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.get("/", (req, res) => {
  // Just for checking Purpose
  res.send("Echoes /- The chat Application");
});

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

server.listen(PORT, () => {
  console.log(`server Listening on the port ${PORT}`);
  connectDB();
});
