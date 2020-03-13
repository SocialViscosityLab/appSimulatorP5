// import socket libraries
var https = require('https');
var fs = require('fs');
var socket = require("socket.io")

// key and certificate
var privateKey = fs.readFileSync('../ssl/keys/d76f2_cf5bf_c5972dce25e2cf13efe9ca98b5f1c284.key', 'utf8');
var certificate = fs.readFileSync('../ssl/certs/socialviscosity_web_illinois_edu_d76f2_cf5bf_1591833599_c645c44194d6dba14d4b1d553cf469df.crt', 'utf8');

// instantiate the server
var server = https.createServer({ key: privateKey, cert: certificate }, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(8080);


// collection of clients
let users = [];

// server is just a function, so this is passed to socket as a parameter
var io = socket.listen(server);

console.log("socket listening")

// Verify if you have a new connection
io.on('connection', newConnection);

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