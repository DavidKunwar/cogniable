const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const nickNames = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {

    socket.on('new user', function(nickname, callback){
        if(nickNames.indexOf(nickname) !== -1){
            callback(false);
        }else{
            callback(true);
            socket.nickname = nickname;
            nickNames.push(socket.nickname);
            updateNicknames();
        }
    });

    function updateNicknames(){
        io.emit('usernames', nickNames);
    }

    socket.on('send message', function(message){
        io.emit('new message', {message: message, name: socket.nickname});
    });

    socket.on('disconnect', function(data){
        if(!socket.nickname){
            return ;
        }else{
            nickNames.splice(nickNames.indexOf(socket.nickname), 1);
            updateNicknames();
        }
    });
});














server.listen(3000, function(){
    console.log('Server up and running at Port: 3000');
});