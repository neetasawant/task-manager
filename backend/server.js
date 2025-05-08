const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server from Express app
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.BASE_URL, // 🔄 Frontend URL
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
app.set("io", io);
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });
});

module.exports.io = io;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
