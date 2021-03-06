var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
        return;
    }

    //Object.keys returns an array of all the methods in the object
    Object.keys(clientInfo).forEach(function (socketId) {
        var userInfo = clientInfo[socketId];

        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }        
    }); 

    socket.emit('message', {
        name: 'System',
        text: 'Current Users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
};

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function () {
      var userData = clientInfo[socket.id];

      if (typeof userData !== 'undefined') {
          socket.leave(userData.room);
          io.to(userData.room).emit('message', {
              name: 'System',
              text: userData.name + ' has left.',
              timestamp: moment().valueOf() 
          });
          delete clientInfo[socket.id];
      }
  });

  // When client connects to socket successfully, it makes a request to the room the user picked
  socket.on('joinRoom', function (req) { //req is the object that is coming from the frontend
      clientInfo[socket.id] = req; //[] means it is dynamic

      socket.join(req.room); //connects the user to the specific room
      socket.broadcast.to(req.room).emit('message', {
          name: 'System',
          text: req.name + ' has joined!',
          timestamp: moment().valueOf()
      });
  });

  socket.on('message', function (message) {
  	console.log('Message Received ' + message.text);
  	
    if (message.text === '@currentUsers') {
        sendCurrentUsers(socket);
    }
    else
    {
        message.timestamp = moment().valueOf();
        //socket.broadcast.emit('message', message); //to all but the sender
        io.to(clientInfo[socket.id].room).emit('message', message)
    };

  	
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
