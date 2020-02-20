// mpn install node, if node is not in the computer
// npm init , to create pakcage.json
// npm install express --save , to intall express in this project
// at this point there should be: i) a folder node_modules, ii) a package-lock.json iii) express in the list of dependencies in package.json
// npm install socket.io --save , to install socket.io. New dependency in pakages.json
// Import Express to host a webpage
var express = require('express');
var app = express();

// Run the server in port 3000
var server = app.listen(3100);

// serve the folder 'public' whenever someone connects to this port
app.use(express.static('../navigator'))

// import socket library
var socket = require("socket.io")

// server is just a function, so this is passed to socket as a parameter
var io = socket(server);

// Verify if you have a new connection
io.sockets.on('connection', newConnection);

//callback once a client is connected
function newConnection(socket) {
    console.log('new connection ' + socket.id)
        // for each received message
    socket.on('message', mouseMsg);

    function mouseMsg(data) {
        console.log(data);
        // broadcast to other clients except the original sender of this message 
        //socket.broadcast.emit('message', data)
    }
}