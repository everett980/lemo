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
let resultsArray = [];
let currentPlayer = 0;


io.on('connection', function(socket) {
  ++numPlayers;
  playerIds.push(socket.id);
  io.emit('numPlayersConnected', numPlayers);
  console.log('a user connected');
  console.log('numPlayers:', numPlayers);
  console.log(playerIds);

  function scoreDifference(previousEmotion, currentEmotion) {
    let max = Math.max(previousEmotion, currentEmotion);
    if (!max) max = 1;
    return Math.min(previousEmotion, currentEmotion) / max;
  }

  function nextTurn() {
    console.log('NEXT TURNNNNNNN')
    io.to(playerIds[currentPlayer]).emit('start game', resultsArray[currentPlayer - 1][3]);
    if(currentPlayer + 1 < playerIds.length) io.to(playerIds[currentPlayer + 1]).emit('next player')
    socket.emit('wait');
  };

  socket.on('disconnect', function() {
    --numPlayers;
    playerIds.splice(playerIds.indexOf(socket.id), 1);
    io.emit('numPlayersConnected', numPlayers);
    console.log('a user disconnected');
    console.log('numPlayers:', numPlayers);
    console.log(playerIds);
  });

  socket.on('connected players ids', function() {
    io.emit(playerIds);
  });

  // [ { data: [Object] }, [ [surprise, 11.449400901794434],  [sadness: 2.9407808780670166] ] ],
  socket.on('submit data', function([ image, [primaryEmotion, secondaryEmotion], gifUrl ]) {
    let score = 0;

    // CALCULATE SCORE FOR PLAYERS OTHER THAN FIRST PLAYER
    if (currentPlayer) {
      // get previous player's data
      const [ prevImage, [prevPrimaryEmotion, prevSecondaryEmotion], prevScore ] = resultsArray[currentPlayer - 1];

      // in case the priorities are in different order switch them
      if (primaryEmotion[0] === prevSecondaryEmotion[0]) [primaryEmotion, secondaryEmotion] = [secondaryEmotion, primaryEmotion];
      else if (secondaryEmotion[0] === prevPrimaryEmotion[0]) [primaryEmotion, secondaryEmotion] = [secondaryEmotion, secondaryEmotion];
      // check if current emotions match previous emotions
      primaryEmotion[1] = primaryEmotion[0] === prevPrimaryEmotion[0] ? primaryEmotion[1] : 0;
      secondaryEmotion[1] = secondaryEmotion[0] === prevSecondaryEmotion[0] ? secondaryEmotion[1] : 0;

      score += (((
        scoreDifference(prevPrimaryEmotion[1], primaryEmotion[1])
        + scoreDifference(prevSecondaryEmotion[1], secondaryEmotion[1])
      ) / 2) * 100 );
      console.log(prevPrimaryEmotion.join(' '), prevSecondaryEmotion.join(' '))
      console.log(primaryEmotion.join(' '), secondaryEmotion.join(' '))
      console.log("SCORE", score);
    }
    resultsArray.push([ image, [primaryEmotion, secondaryEmotion], score, gifUrl]);

    // increment turn number
    currentPlayer++;

    // HANDLE ENDGAME
    if (resultsArray.length === playerIds.length) {
      // CALCULATE FIRST PLAYER'S SCORE
      // grab first and final players' data
      let [ originalImage, [originalPrimaryEmotion, originalSecondaryEmotion], originalScore ] = resultsArray[0];
      let [ finalImage, [finalPrimaryEmotion, finalSecondaryEmotion], finalScore ] = resultsArray[resultsArray.length - 1];
      console.log('FINAL EMOTES', originalPrimaryEmotion.join(' '), originalSecondaryEmotion.join(' '));
      console.log('SECONDARY', finalPrimaryEmotion.join(' '), finalSecondaryEmotion.join(' '))
      // in case the priorities are in different order switch them
      if (originalPrimaryEmotion[0] === finalSecondaryEmotion[0]) [originalPrimaryEmotion, originalSecondaryEmotion] = [originalSecondaryEmotion, originalPrimaryEmotion];
      else if (originalSecondaryEmotion[0] === finalPrimaryEmotion[0]) [originalPrimaryEmotion, originalSecondaryEmotion] = [originalSecondaryEmotion, originalPrimaryEmotion];
      // check if final emotions match original emotions
      originalPrimaryEmotion[1] = originalPrimaryEmotion[0] === finalPrimaryEmotion[0] ? originalPrimaryEmotion[1] : 0;
      originalSecondaryEmotion[1] = originalSecondaryEmotion[0] === finalSecondaryEmotion[0] ? originalSecondaryEmotion[1] : 0;
      console.log('COMPARE', originalPrimaryEmotion.join(' '), originalSecondaryEmotion.join(' '))
      // save first player's score to results
      resultsArray[0][2] += (((
        scoreDifference(finalPrimaryEmotion[1], originalPrimaryEmotion[1])
        + scoreDifference(finalSecondaryEmotion[1], originalSecondaryEmotion[1])
      ) / 2) * 100);
      console.log(resultsArray[0][2])

      // END GAME
      io.emit('game over', resultsArray);
    // handle moving to next turn
    } else {
      nextTurn();
    }
  });

  socket.on('start game', function() {
    currentPlayer = 0;
    resultsArray = [];
    const tempCopy = [];
    while(playerIds.length) {
      tempCopy.push(playerIds.splice(Math.floor(Math.random() * playerIds.length), 1)[0]);
    };
    playerIds = tempCopy;
    io.to(playerIds[0]).emit('start game');
    playerIds.forEach((id, index) => {
      if(index) {
        io.to(id).emit('wait');
      }
    });
  })

});

http.listen(process.env.PORT || 3001, function() {
  console.log('listening on port 3001');
});
