// mpn install node, if node is not in the computer
// npm init , to create pakcage.json
// npm install express --save , to intall express in this project
// at this point there should be: i) a folder node_modules, ii) a package-lock.json iii) express in the list of dependencies in package.json
// npm install socket.io --save , to install socket.io. New dependency in pakages.json
// Import Express to host a webpage

/** La ultima vez que lo corrimos lo hicomos asi:
 * bash-3.2# node /Users/jsal/Documents/GitHub/ABMS_Bicycles/appSimulatorP5/server/index.js
 */

var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey = fs.readFileSync('/Users/jsal/localhost-ssl/server.key', 'utf8');
var certificate = fs.readFileSync('/Users/jsal/localhost-ssl/server.crt', 'utf8');
let users = [];

// var privateKey = fs.readFileSync('/Users/Dani/.localhost-ssl/localhost.key', 'utf8');
// var certificate = fs.readFileSync('/Users/Dani/.localhost-ssl/localhost.crt', 'utf8');

var credentials = {
    key: privateKey,
    cert: certificate,
    requestCert: false,
    rejectUnauthorized: false
};

var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var port = 3100;
var server = httpsServer.listen(port);
//httpsServer.listen(8443);
console.log("Running code index.js. Port: " + port)


// Run the server in port 8080
//var server = app.listen(8080);

// serve the folder 'public' whenever someone connects to this port
//app.use(express.static('../navigator'))
app.use(express.static('/Users/jsal/Documents/GitHub/ABMS_Bicycles/appSimulatorP5/navigator'))

// import socket library
var socket = require("socket.io")

// server is just a function, so this is passed to socket as a parameter
var io = socket.listen(server);

// Verify if you have a new connection
io.sockets.on('connection', newConnection);

//callback once a client is connected
function newConnection(socket) {
    console.log('new connection ' + socket.id)
        // for each received message
    socket.on('message', mouseMsg);
    socket.on('disconnect', function() {
        saveSession(socket.client.conn.id);
        console.log("desconected" + socket.client.conn.id)

    });

    function mouseMsg(data, data2, time) {

        message = {
            id: socket.client.conn.id,
            coord: data,
            gcoord: data2,
            timeStamp: time
        }
        addToJson(message)
        console.log(message)

        // broadcast to other clients except the original sender of this message 
        //socket.broadcast.emit('message', data)
    }
}


function saveSession(id) {
    fs.writeFile("/Users/jsal/Documents/GitHub/ABMS_Bicycles/appSimulatorP5/userCollectedData/json_" + id + ".json", JSON.stringify(users[id], null, "\t"), function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log('JSON saved')
}



function addToJson(message) {

    let id = message.id;
    let timeStamp = message.timeStamp;

    if (users >= 0) {
        if (!users[id]) {
            users[id] = {}
        } else {
            users[id][timeStamp] = { "coord": message.coord, "gcoord": message.gcoord }
        }
    }
}