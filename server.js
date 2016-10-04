var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {

};

io.on('connection', function(socket){
  console.log('a user connected');

  // When client connects to socket successfully, it makes a request to the room the user picked
  socket.on('joinRoom', function (req) { //req is the object that is coming from the frontend
      clientInfo[socket.id] = req;

      socket.join(req.room); //connects the user to the specific room
      socket.broadcast.to(req.room).emit('message', {
          name: 'System',
          text: req.name + ' has joined!',
          timestamp: moment().valueOf()
      });
  });

  socket.on('message', function (message) {
  	console.log('Message Received ' + message.text);
  	
  	message.timestamp = moment().valueOf();
  	//socket.broadcast.emit('message', message); //to all but the sender
  	io.to(clientInfo[socket.id].room).emit('message', message)
  });

  //timestamp property - JS timestamp (milliseconds)

	//server is listening for message
	socket.emit('message', {
    name: 'System',
    room: 'System',
		text: 'Welcome to the chat application',
		timestamp: moment().valueOf()
	});

});

http.listen(PORT, function(){
  console.log('listening on *:3000');
});
