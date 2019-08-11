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
history = [];

io.on("connection", function(socket) {
  socket.name = undefined;
  socket.emit("updatePlayers", players);
  socket.emit("updateHistory", history);
  socket.on("addPlayer", function(name) {
    if (players.filter(elem => elem.name == name).length == 0) {
      players.push(new Player(name));
      io.emit("updatePlayers", players);
    }
    socket.name = name;
  });
  socket.on("vote", function(name) {
    if (socket.name != undefined) {
      let target = players.find(elem => elem.name == name);
      if (target) {
        //current voter is not already voting for the target
        if (target.voters.find(elem => elem == socket.name) == undefined) {
          //remove current voter from all other targets
          for (let player of players) {
            player.voters = player.voters.filter(elem => elem != socket.name);
          }
          target.voters.push(socket.name);
          //add this to history]
          history.push(`${socket.name} has VOTED for ${target.name}`);
        } else {
          //current voter is trying to unvote
          target.voters = target.voters.filter(elem => elem != socket.name);
          //add this to history
          history.push(`${socket.name} has UNVOTED for ${target.name}`);
        }
        io.emit("updatePlayers", players);
        io.emit("updateHistory", history);
      }
    }
  });
  socket.on("reset", function() {
    socket.name = undefined;
    players = [];
    history = [];
    io.emit("updatePlayers", players);
    io.emit("updateHistory", history);
  });
});
