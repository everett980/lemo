var express= require('express')
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


io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
  socket.on('chat message', function(message) {
    console.log(message);
    io.emit('chat message', message);
  });
});

http.listen(3001, function() {
  console.log('listening on port 3001');
});
