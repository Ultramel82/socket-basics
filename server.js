var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('message', function (message) {
  	console.log('Message Received ' + message.text);
  	//socket.broadcast.emit('message', message); //to all but the sender
  	io.sockets.emit('message', message);
  });

	//server is listening for message
	socket.emit('message', {
		text: 'Welcome to the chat application'
	});

});

http.listen(PORT, function(){
  console.log('listening on *:3000');
});
