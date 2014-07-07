var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
	//---
  //res.send('<h1>Hello world</h1>');

	//---
	res.sendfile('index.html');
});


// socket.io setup
var io = require('socket.io')(http);
var clients = []; // record the collection of connection
var names = {};  // socket id => name


io.on('connection', function(socket){
  console.log('a user connected');


	// HW#2, NOTE: once user connected, we assign user a random name and prompt message to hint nickname change
	console.log(socket.id); // Q: why two print out? A: 
	clients.push(socket);

	// HW#1: Broadcast a message to connected users when someone connects or disconnects
  socket.broadcast.emit('chat message', "New comer: " + socket.client.id);


  socket.on('disconnect', function(){
    console.log('user disconnected');
	var index = clients.indexOf(socket);
        if (index != -1) {
			// clean the socket
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
			// clean the names
			delete(names[socket.id]);
        }

	// HW#1 
	//socket.broadcast.emit('chat message', "Someone left ...");
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    //io.emit('chat message', msg);
	
    // HW#2 Add support for nicknames
	// IDEA: when user enter room, they are anonymous, I think it's proper to stay anonymous until user tries to say something, then ask for nickname
	if ( msg.indexOf("/NAME")===0 ){
		name = msg.replace("/NAME", "" ).trim();
		oldname = names[socket.id];
		io.emit('chat message', "User renamed: " + name + " (originally: " + oldname + ")" );
		names[socket.id] = name;
		console.log("Know user names : " + names[socket.id] );
	} else {
		// normal message for public
		io.emit('chat message', names[socket.id] + ": " + msg);
	}   
  });





});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
