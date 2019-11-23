"use strict";
var express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static("build"));
let port = 8000;
http.listen(port, function() {
  console.log("Port is:" + port);
});
class Player {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
    this.voters = [];
    this.name = name;
    this.socket = socket;
  }
}
class HistoryElement {
  constructor(string) {
    this.string = string;
    this.time = Date().slice(16, 21);
  }
}
class Room {
  constructor(code) {
    this.players = [];
    this.history = [];
    this.code = code;
  }
}
let rooms = [new Room("hello")];
io.on("connection", function(socket) {
  let broadcastUpdate = room => {
    for (let player of room.players) {
      player.socket.emit("updatePlayers", room.players);
      player.socket.emit("updateHistory", room.history);
    }
  };
  let room = undefined;
  socket.on("enterRoom", function(roomCode) {
    let newRoom = rooms.find(room => room.code == roomCode);
    if (newRoom) {
      room = newRoom;
      socket.emit("enterRoom");
      socket.emit("updatePlayers", room.players);
      socket.emit("updateHistory", room.history);
    }
  });
  socket.on("addPlayer", function(name) {
    if (room) {
      if (room.players.filter(elem => elem.name == name).length == 0) {
        room.players.push(new Player(name, socket));
        broadcastUpdate(room);
      }
      socket.name = name;
    }
  });
  socket.on("vote", function(name) {
    if (name && room) {
      let target = room.players.find(elem => elem.name == name);
      if (target) {
        //current voter is not already voting for the target
        if (target.voters.find(elem => elem == socket.name) == undefined) {
          //remove current voter from all other targets
          for (let player of room.players) {
            player.voters = player.voters.filter(elem => elem != socket.name);
          }
          target.voters.push(name);
          //add this to history]
          socket.room.history.push(
            new HistoryElement(
              `${socket.name} has voted for ${target.name} (${target.voters.length})`,
            ),
          );
        } else {
          //current voter is trying to unvote
          target.voters = target.voters.filter(elem => elem != socket.name);
          //add this to history
          socket.room.history.push(
            new HistoryElement(
              `${socket.name} has unvoted for ${target.name} (${target.voters.length})`,
            ),
          );
        }
        broadcastUpdate(socket.room);
      }
    }
  });
  socket.on("restart", function() {
    socket.name = undefined;
    if (socket.room) {
      socket.room.players = [];
      socket.room.history = [];
    }
    broadcastUpdate(socket.room);
  });
  socket.on("clearVotes", function() {
    for (let player of socket.room.players) {
      player.voters = [];
    }
    broadcastUpdate(socket.room);
  });
});
