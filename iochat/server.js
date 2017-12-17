// https://www.youtube.com/watch?v=tHbCkikFfDE
// https://www.youtube.com/watch?v=8Y6mWhcdSUM
// https://www.youtube.com/watch?v=hrRue5Rt6Is
// http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect
// https://stackoverflow.com/questions/10656574/how-do-i-manage-mongodb-connections-in-a-node-js-web-application
// http://mongodb.github.io/node-mongodb-native/3.0/quick-start/quick-start/

// import libraries
const moduleExpressJS = require('express');
const moduleHttp = require('http');
const moduleSocketIo = require('socket.io');
const moduleMongoDb = require('mongodb');

// environment acquaintance
const strMongoHost = 'mongodb://' + process.env.IP + ':' + '27017';
const strMongoDatabaseName = 'mongochat';

// connect to MongoDB instance
var db;
var chat;
const mongoClient = moduleMongoDb.MongoClient;
mongoClient.connect(strMongoHost + '/', function(err, databaseClient){
    if (err) throw err;
    db = databaseClient.db(strMongoDatabaseName);
    chat = db.collection('chat');
});

// ExpressJS app listener
const expressJsApp = moduleExpressJS();
const httpServer = moduleHttp.createServer(expressJsApp);

// Socket.io listener - listen through 
const socketHandler = moduleSocketIo.listen(httpServer);

// Starts the server
httpServer.listen(process.env.PORT, process.env.IP);
console.log ('Serving on https://' + process.env.C9_HOSTNAME + ':' + process.env.PORT)

var users = [];
var connections = [];

expressJsApp.get ('/', function(req, res) {
    console.log ('root route requested');
    res.sendFile(__dirname + '/index.html');
});

// Listener for connection requests on socket.io
socketHandler.sockets.on('connection', function(socket) {


    // --------------------------------------
    // SOCKET CONNECTION
    
    // Register the socket in the sockets array
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    
    // Send the latest 100 chat messages to the socket
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res) {
        if (err) throw err;
        socket.emit('current messages', res);
    });
    
    
    // --------------------------------------
    // SOCKET EVENT LISTENERS
    
    // Disconnect
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        
        // Notify all sockets a user is gone
        socketHandler.sockets.emit('user gone', socket.username);
        updateUsernames();
        
        // remove the socket object from the connections array
        connections.splice(connections.indexOf(socket), 1);    
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    
    // Send message: notify all sockets that there is a new message in the chat.
    socket.on('send message', function(data) {
        console.log("Receiving message on server: " + data);
        let msgObject = {
            msg: data,
            user: socket.username,
            datetime: new Date()
        }
        chat.insert(msgObject, function() {
            socketHandler.sockets.emit('new message', msgObject);
        });
    });
    
    // New user: notify all sockets that a new user have joined the chat.
    socket.on('new user', function(data, callback) {
       socket.username = data;
       users.push(socket.username);
       updateUsernames();
       socketHandler.sockets.emit('new user', socket.username);
       callback(true);
    });
    
    socket.on('clear', function() {
        chat.remove(function() {
           socketHandler.sockets.emit('clear'); 
        });
    })
    
    function updateUsernames() {
        socketHandler.sockets.emit('get users', users);
    }
    
});