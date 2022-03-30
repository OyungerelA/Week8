let express = require('express');
let http = require('http');
let io = require('socket.io');

let app = express();
let server = http.createServer(app);
io = new io.Server(server);

app.use('/', express.static('public'));

io.sockets.on('connect', (socket) =>{
    console.log('we have a new client: ', socket.id);

    socket.on('disconnect', () => {
        console.log('connections ended: ', socket.id);
    })

    // on receiving the translated word from client
    socket.on('wordTranslation', (data) => {
        console.log(data);

        // emit the received data back to all clients
        io.sockets.emit('wordTranslation', data);
    })

    // on receiving the randomly generated word from client
    socket.on('randomWord', (data) => {
        console.log(data);

        // emit it back to all clients
        io.sockets.emit('randomWord', data);
    })

    socket.on('error', (data) =>{
        socket.emit('error', data);
    })
})


server.listen(3000, ()=>{
    console.log("server is up");
})