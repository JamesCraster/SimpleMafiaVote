var app = require("http").createServer();
var io = require("socket.io")(app);

app.listen(8000);

class Player {
  constructor(name) {
    this.name = name;
    this.voters = [];
  }
}

players = [];

io.on("connection", function(socket) {
  socket.emit("updatePlayers", players);
  socket.on("addPlayer", function(name) {
    console.log(name);
    if (players.filter(elem => elem.name == name).length == 0) {
      players.push(new Player(name));
      socket.emit("updatePlayers", players);
    }
  });
});
