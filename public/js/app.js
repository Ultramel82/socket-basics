var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' joined ' + room);

socket.on('connect', function () {
	console.log('Connected to Socket IO Server');
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $message = jQuery('.messages');

	console.log('New Message: ');
	console.log(message.text);

	$message.append('<div style=\'background-color:#FF0000;\'><p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p></div>')
	$message.append('<p>' + message.text + '</p>');
	//$message.append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ':</strong> ' + message.text + '</p>'); //. = class # = id

});

// Handles submitting of new message
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
