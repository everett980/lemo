var express = require('express')
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/socketConfig.js', express.static(__dirname+'/socketConfig.js'));
app.use('/public', express.static(path.normalize(__dirname+'/../public')));
app.use('/static', express.static(path.normalize(__dirname+'/../build/static')));
app.use('/node_modules', express.static(path.normalize(__dirname+'/../node_modules')));
app.use('/browser', express.static(path.normalize(__dirname+'/../browser')));

app.get('/', function(req, res, next) {
  res.sendFile(path.normalize(__dirname+'/../build/index.html'));
});

let numPlayers = 0;
let playerIds = [];
const resultsArray = [];
let currentPlayer = 0;


io.on('connection', function(socket) {
  ++numPlayers;
  playerIds.push(socket.id);
  io.emit('numPlayersConnected', numPlayers);
  console.log('a user connected');
  console.log('numPlayers:', numPlayers);
  console.log(playerIds);

  function tellNext() {
    console.log(currentPlayer);
    console.log(playerIds[currentPlayer]);
    io.to(playerIds[currentPlayer]).emit('start game', 'start game!');
  };

  socket.on('disconnect', function() {
    --numPlayers;
    playerIds.splice(playerIds.indexOf(socket.id), 1);
    io.emit('numPlayersConnected', numPlayers);
    console.log('a user disconnected');
    console.log('numPlayers:', numPlayers);
    console.log(playerIds);
  });

  socket.on('chat message', function(message) {
    console.log(message);
    io.emit('chat message', message);
  });

  socket.on('connected players ids', function() {
    io.emit(playerIds);
  });

  socket.on('submit data', function(message) {
    currentPlayer++;
    resultsArray.push(message);
    // TODO: Process score if not first data point
    console.log(resultsArray.length, playerIds);
    if (resultsArray.length === playerIds.length) {
      // TODO: Calculate first person's score
      io.emit('game over', resultsArray);
    } else {
      tellNext();
    }
  });

  socket.on('start game', function() {
    // io.emit('start game', 'start game!');
    // io.emit('connected players ids', 'emit them!');
    const tempCopy = [];
    while(playerIds.length) {
      tempCopy.push(playerIds.splice(Math.floor(Math.random() * playerIds.length), 1)[0]);
    };
    playerIds = tempCopy;
    tellNext();
  })
});

http.listen(3001, function() {
  console.log('listening on port 3001');
});
