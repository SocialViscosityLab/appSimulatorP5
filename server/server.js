// mpn install node, if node is not in the computer
// npm init , to create pakcage.json
// npm install express --save , to intall express in this project
// at this point there should be: i) a folder node_modules, ii) a package-lock.json iii) express in the list of dependencies in package.json
// npm install socket.io --save , to install socket.io. New dependency in pakages.json
// Import Express to host a webpage
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/Users/Dani/.localhost-ssl/localhost.key', 'utf8');
var certificate = fs.readFileSync('/Users/Dani/.localhost-ssl/localhost.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

console.log("hooli")

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

var server = httpsServer.listen(8080);
//httpsServer.listen(8443);



// Run the server in port 8080
//var server = app.listen(8080);

// serve the folder 'public' whenever someone connects to this port
app.use(express.static('../navigator'))

// import socket library
var socket = require("socket.io")

// server is just a function, so this is passed to socket as a parameter
var io = socket(server);
var startTime = Date.now();

// Verify if you have a new connection
io.sockets.on('connection', newConnection);

//callback once a client is connected
function newConnection(socket) {
    console.log('new connection ' + socket.id)
        // for each received message
    socket.on('message', mouseMsg);
  

    socket.on('disconnect', function() {
        saveSession(socket.client.conn.id)
        console.log("desconeted" + socket.client.conn.id)

    });

    function mouseMsg(data, data2) {
        message = {
            id: socket.client.conn.id,
            coord: data,
            gcoord: data2,
            timeStamp: getEllapsedTime()
        }
        console.log(message)
        addToJson(message)
    }
}

function getEllapsedTime() {
    return Date.now() - startTime;
}

function saveSession(id) {
    fs.writeFile("json_"+id+".json", JSON.stringify(users[id], null, "\t"), function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log('JSON saved')
}

let users = [];

function addToJson(message) {

    let id = message.id;
    let timeStamp = message.timeStamp;

    if (users >= 0) {
        if (!users[id]) {
            users[id] = {}
        } else {
            users[id][timeStamp] ={"coords": message.coord, "gcoord": message.gcoord}
        }
    }
}