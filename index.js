const { Server } = require("socket.io");
const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:5173"]
  }
});

io.on('connect', (socket) => {
  console.log('A user connected: ', socket.id);
});