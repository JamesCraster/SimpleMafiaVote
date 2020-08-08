var express = require("express");
const app = express();
const path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("build"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
let port = 8000;
http.listen(port, function () {
  console.log("Port is:" + port);
});

class Player {
  constructor(name, socket) {
    this.name = name;
    this.voters = [];
    this.deadVoters = [];
    this.dead = false;
    this.socket = socket;
  }
}

class HistoryElement {
  constructor(string) {
    this.string = string;
    this.time = Date().slice(16, 21);
  }
}
roles = [
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
];
discards = [
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
  "N/A",
];
players = [];
history = [];
deadline = "";
io.on("connection", function (socket) {
  broadcastUpdate = (name) => {
    io.emit("updatePlayers", players);
    io.emit("updateHistory", history);
    io.emit(
      "updateModerator",
      players.map((player, index) => `${player.name} - ${roles[index]}`),
    );
    io.emit(
      "updateDiscards",
      players.map(
        (player, index) =>
          `${player.name} - ${index < discards.length ? discards[index] : ""}`,
      ),
    );
  };
  broadcastUpdate();
  socket.name = undefined;
  socket.emit("updatePlayers", players);
  socket.emit("updateHistory", history);
  socket.on("addPlayer", function (name) {
    if (players.filter((elem) => elem.name == name).length == 0) {
      players.push(new Player(name, socket.id));
      io.emit("updatePlayers", players);
      socket.emit("giveRole", roles[players.length - 1]);
    } else {
      console.log();
      players.filter((elem) => elem.name == name)[0].socket = socket.id;
      socket.emit(
        "giveRole",
        roles[players.indexOf(players.filter((elem) => elem.name == name)[0])],
      );
    }
    socket.name = name;
    broadcastUpdate();
  });
  socket.on("toggleDead", function (name) {
    let target = players.find((elem) => elem.name == name);
    if (target) {
      target.dead = !target.dead;
      if (target.voters === []) {
        target.voters = target.deadVoters;
      } else {
        target.deadVoters = target.voters;
      }
      if (target.dead) {
        players.forEach(
          (player) =>
            (player.voters = player.voters.filter(
              (voter) => voter !== target.name,
            )),
        );
      }
    }
    broadcastUpdate();
  });
  socket.on("updateRoles", (newRoles) => {
    console.log("updated roles");
    roles = newRoles;
    for (player of players) {
      io.to(player.socket).emit(
        "giveRole",
        roles[
          players.indexOf(players.filter((elem) => elem.name == player.name)[0])
        ],
      );
    }
    broadcastUpdate();
  });

  socket.on("greaterIdea", () => {
    console.log("greater idea");
    roles = players.map((player) => {
      return `${
        greaterRoles[Math.floor(Math.random() * greaterRoles.length)]
      } OR ${greaterRoles[Math.floor(Math.random() * greaterRoles.length)]}`;
    });
    for (i = 0; i < 10; i++) {
      roles.push("N/A");
    }
    discards = [
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
    ];
    for (player of players) {
      io.to(player.socket).emit(
        "giveRole",
        roles[
          players.indexOf(players.filter((elem) => elem.name == player.name)[0])
        ],
      );
    }
    broadcastUpdate();
  });
  socket.on("discard", function (number) {
    discards[
      players.indexOf(players.filter((elem) => elem.socket == socket.id)[0])
    ] = roles[
      players.indexOf(players.filter((elem) => elem.socket == socket.id)[0])
    ].split("OR")[number == 0 ? 0 : 1];
    roles[
      players.indexOf(players.filter((elem) => elem.socket == socket.id)[0])
    ] = roles[
      players.indexOf(players.filter((elem) => elem.socket == socket.id)[0])
    ].split("OR")[number == 0 ? 1 : 0];
    socket.emit(
      "giveRole",
      roles[
        players.indexOf(players.filter((elem) => elem.socket == socket.id)[0])
      ],
    );
    broadcastUpdate();
  });
  socket.on("vote", function (name) {
    if (socket.name != undefined) {
      let target = players.find((elem) => elem.name == name);
      if (target) {
        //current voter is not already voting for the target
        if (target.voters.find((elem) => elem == socket.name) == undefined) {
          //remove current voter from all other targets
          for (let player of players) {
            player.voters = player.voters.filter((elem) => elem != socket.name);
          }
          target.voters.push(socket.name);
          //add this to history
          history.push(
            new HistoryElement(
              `${socket.name} has voted for ${target.name} (${
                target.voters.length
              }${
                target.voters.length > 0 ? ", " + target.voters.join(",") : ""
              })`,
            ),
          );
        } else {
          //current voter is trying to unvote
          target.voters = target.voters.filter((elem) => elem != socket.name);
          //add this to history
          history.push(
            new HistoryElement(
              `${socket.name} has unvoted for ${target.name} (${
                target.voters.length
              }${
                target.voters.length > 0 ? "," + target.voters.join(",") : ""
              })`,
            ),
          );
        }
        broadcastUpdate();
      }
    }
  });
  socket.on("restart", function () {
    socket.name = undefined;
    players = [];
    history = [];
    roles = [
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
    ];
    discards = [
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
    ];
    io.emit("restart");
    broadcastUpdate();
  });
  socket.on("delete", function (target) {
    console.log("delete received");
    console.log(target);
    console.log(players);
    players = players.filter((elem) => elem.name !== target);
    players.forEach(
      (player) =>
        (player.voters = player.voters.filter((voter) => voter !== target)),
    );
    console.log(players);
    broadcastUpdate();
  });
  socket.on("clearVotes", function () {
    for (let player of players) {
      player.voters = [];
    }
    history.push(new HistoryElement("The votes have been reset"));
    broadcastUpdate();
  });
});
greaterRoles = `Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Vanilla Townie
Watcher
Tracker
Tracker
Cop
Cop
Cop Lover
Seer
Seer
FBI Agent
Doctor
Doctor
Roleblocker
Jailkeeper
Bodyguard
Vigilante
One-shot Vigilante
One-shot Dayvig
One-shot Dayvig
Compulsive Childkiller
Bulletproof Townie
Supersaint
One-shot Paranoid Gun Owner
Mason
Mason
Mason
Mason
Mason Doctor
Mason Lover
Lover
Lover
Lover
Jack-of-all-trades
Vengeful Townie
Retired Werewolf Hunter
Retired Marine
Miller
Hirsute Townie
Evangelistic Townie
Tentacled Townie 
Watchlisted Townie
Wrong Place at the Wrong Time Townie
Black Goo
Ascetic Townie
Private Investigator
Gravedigger
Nymphomaniac
One-shot Governor
One-shot Prince
Town Godfather
Innocent Child
Hider
Enabler
Treestump
Conspiracy Theorist
Conspiracy Theorist
Conspiracy Theorist
One-shot Kingmaker
Weak Jailkeeper
Bloodhound 
Vanilla Cop
Hero
Nurse 
One-shot Commuter
Cop-of-all-Trades
One-shot Gladiator
Persona Non Grata
Psychiatrist
Reloader
Fruit Vendor
Parrot Role
Judas
Saulus
One-shot Townie
Underdog
Mafia Goon
Mafia Goon
Mafia Goon
Mafia Goon
Mafia Goon
Mafia Godfather
Mafia Tracker
Mafia Doctor
Mafia Roleblocker
Mafia Lover
Mafia Seer
Mafia One-shot Dayvig
Mafia One-shot Governor
Mafia Strongman
Mafia Reflexive Doctor
Hirsute Goon
Mafia Cupid
Alpha Goon
Mafia Compulsive Hider
Mafia Fruit Vendor
Werewolf
Werewolf
Werewolf
Werewolf
Alpha Werewolf
Werewolf Roleblocker
Werewolf One-shot Bulletproof
Werewolf Cop
Werewolf Mason
Werewolf Watcher
Werewolf FBI Agent
Ninja Werewolf
Werewolf One-shot PGO
Werewolf Miller
Werewolf Supersaint
Werewolf Godfather
Werewolf Gravedigger
Wereparrot
Alien One-shot Prince
Alien Prober
Alien Vanillaiser
Alien Silencer
Bulletproof Alien Lover
Alien Psychotrooper
Alien Mass Redirector
Alien Bloodsucker
Alien Sympathiser
Survivor
Compulsive Bodyguard Survivor
Survivor Mason
Condemner 
Condemner 
Serial Killer 
Serial Killer 
Serial Killer 
Serial Killer 
One-shot Cult Recruiter
Cult One-shot Goomaker`.split("\n");
