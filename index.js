const { Server } = require("socket.io");
require('dotenv').config()
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(process.env.PORT, {
  cors: {
    origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
    credentials: true
  }
});

io.on('connect', (socket) => {
  console.log('A user connected: ', socket.id);

  socket.on("host-game", (gameCode, username, hostCallBack) => {
    socket.nickname = `Host:${username}`
    socket.join(gameCode)
    hostCallBack("Waiting for others to join...")
  })

  socket.on("join-game", (gameCode, username, gameLevel) => {
    socket.nickname = `Join:${username}`
    socket.join(gameCode)
    io.in(gameCode).emit("other-joined", "Game Start", gameLevel)
  })

  socket.on("add-score", (gameCode, targetID, item) => {
    console.log("Add Score", gameCode)
    socket.to(gameCode).emit("show-score", targetID, item)
  })

  socket.on("game-over", (gameCode, time) => {
    console.log("Game Over")
    socket.to(gameCode).emit("over-show", time)
  })

});

instrument(io, {
  auth: false
});