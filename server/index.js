var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static("build"));
var port = 8000;
http.listen(port, function () {
    console.log("Port is:" + port);
});
var Player = /** @class */ (function () {
    function Player(name, socket) {
        this.name = name;
        this.socket = socket;
        this.voters = [];
        this.name = name;
        this.socket = socket;
    }
    return Player;
}());
var HistoryElement = /** @class */ (function () {
    function HistoryElement(string) {
        this.string = string;
        this.time = Date().slice(16, 21);
    }
    return HistoryElement;
}());
var Room = /** @class */ (function () {
    function Room(code) {
        this.players = [];
        this.history = [];
        this.code = code;
    }
    return Room;
}());
var rooms = [new Room("hello")];
io.on("connection", function (socket) {
    console.log('gained connection');
    var broadcastUpdate = function (room) {
        for (var _i = 0, _a = room.players; _i < _a.length; _i++) {
            var player = _a[_i];
            player.socket.emit("updatePlayers", room.players);
            player.socket.emit("updateHistory", room.history);
        }
    };
    var room = new Room('only');
    socket.on("enterRoom", function (roomCode) {
        var newRoom = rooms.find(function (room) { return room.code == roomCode; });
        if (newRoom) {
            room = newRoom;
            socket.emit("enterRoom");
            socket.emit("updatePlayers", room.players);
            socket.emit("updateHistory", room.history);
        }
        else {
            socket.emit("enterRoomFailed");
        }
    });
    socket.on("addPlayer", function (name) {
        if (room) {
            if (room.players.filter(function (elem) { return elem.name == name; }).length == 0) {
                room.players.push(new Player(name, socket));
                broadcastUpdate(room);
            }
            socket.name = name;
        }
    });
    socket.on("vote", function (name) {
        if (name && room) {
            var target = room.players.find(function (elem) { return elem.name == name; });
            if (target) {
                //current voter is not already voting for the target
                if (target.voters.find(function (elem) { return elem == socket.name; }) == undefined) {
                    //remove current voter from all other targets
                    for (var _i = 0, _a = room.players; _i < _a.length; _i++) {
                        var player = _a[_i];
                        player.voters = player.voters.filter(function (elem) { return elem != socket.name; });
                    }
                    target.voters.push(name);
                    //add this to history]
                    socket.room.history.push(new HistoryElement(socket.name + " has voted for " + target.name + " (" + target.voters.length + ")"));
                }
                else {
                    //current voter is trying to unvote
                    target.voters = target.voters.filter(function (elem) { return elem != socket.name; });
                    //add this to history
                    socket.room.history.push(new HistoryElement(socket.name + " has unvoted for " + target.name + " (" + target.voters.length + ")"));
                }
                broadcastUpdate(socket.room);
            }
        }
    });
    socket.on("restart", function () {
        socket.name = undefined;
        if (socket.room) {
            socket.room.players = [];
            socket.room.history = [];
        }
        broadcastUpdate(socket.room);
    });
    socket.on("clearVotes", function () {
        for (var _i = 0, _a = socket.room.players; _i < _a.length; _i++) {
            var player = _a[_i];
            player.voters = [];
        }
        broadcastUpdate(socket.room);
    });
});
