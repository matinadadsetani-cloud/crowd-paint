const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const COLS = 20; // 20 × 20 = 400 بلوک
const ROWS = 20;
const TOTAL = COLS * ROWS;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let order = [];
let revealed = 0;
let imageDataURL = null;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newOrder() {
  order = Array.from({ length: TOTAL }, (_, i) => i);
  shuffle(order);
}
newOrder();

io.on("connection", (socket) => {
  console.log("✅ client connected");

  socket.on("click", () => {
    if (revealed < TOTAL) {
      revealed++;
      io.emit("reveal", { revealed });
    }
  });

  socket.on("reset", () => {
    revealed = 0;
    newOrder();
    io.emit("reset", { order, revealed });
  });

  socket.on("setImage", (dataUrl) => {
    if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
      imageDataURL = dataUrl;
      io.emit("image", { image: imageDataURL });
    }
  });

  socket.on("getState", () => {
    socket.emit("init", { cols: COLS, rows: ROWS, order, revealed, image: imageDataURL });
  });

  socket.on("disconnect", () => console.log("❌ client disconnected"));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
