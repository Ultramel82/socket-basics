var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' joined ' + room);

// UPDATE ROOM NAME
jQuery('.room-title').text('Room Name: ' + room);

socket.on('connect', function () {
	console.log('Connected to Socket IO Server');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

// LISTEN FOR MESSAGE
socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New Message: ');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>')
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
	
});

// HANDLES SUBMITTING OF NEW MESSAGE
var $form = jQuery('#message-form'); //$ the variable stores an jQuery instance of a variable (this variable has access to all the methods you can access on the specific jQuery element)

$form.on('submit', function (event) {
	$message = $form.find('input[name=message]');
	event.preventDefault(); //dont send old fasioned way with postbacks
	socket.emit('message', {
		name: name,
		text: $message.val()
	});
	$message.val('');
});

