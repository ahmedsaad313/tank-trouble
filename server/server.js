const io = require('socket.io')(3000, {
    cors: {
        origin: ["http://localhost:8080"],
    }
})

io.on("connection", (socket) => {
    //console.log(socket.id);
    //testing
    socket.on('custom-event', (number, string, object) => {
        //console.log(number, string, object);
    })
    //server recieves client data
    socket.on('opponent-update', (x, y, degree) => {
    //server send client data to other client
        socket.broadcast.emit('send-opponent-update', x, y, degree);
    })

    socket.on('new-bullet-update', (x, y, life, xInc, yInc) => {
        socket.broadcast.emit('send-new-bullet-update', x, y, life, xInc, yInc);
    })

    socket.on('delete-bullet-update', (bullPos) => {
        socket.broadcast.emit('send-delete-bullet-update', bullPos);
    }) 

    socket.on('new-hearts-update', (hearts) => {
        socket.broadcast.emit('send-new-hearts-update', hearts);
    }) 
})