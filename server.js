const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// فایل‌های استاتیک (screen.html و click.html)
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('یک کاربر وصل شد');

  // وقتی کسی کلیک می‌کنه
  socket.on('click_event', (data) => {
    // ارسال به همهٔ screen ها
    io.emit('draw_point', data);
  });

  socket.on('disconnect', () => {
    console.log('یک کاربر خارج شد');
  });
});

server.listen(3000, () => {
  console.log('سرور روی http://localhost:3000 اجرا شد');
});
