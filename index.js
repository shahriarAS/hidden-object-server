const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    credentials: true
  }
});

io.on('connect', (socket) => {
  console.log('A user connected: ', socket.id);

  socket.on("host-game", (gameCode, hostCallBack) => {
    socket.join(gameCode)
    hostCallBack("Waiting for others to join...")
  })

  socket.on("join-game", (gameCode, gameLevel) => {
    socket.join(gameCode)
    io.in(gameCode).emit("other-joined", "Game Start", gameLevel)
  })

  socket.on("add-score", (gameCode, targetID, item) => {
    console.log("Add Score: ", targetID )
    socket.to(gameCode).emit("show-score", targetID, item)
  })

});

instrument(io, {
  auth: false
});