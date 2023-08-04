//const { io } = require('socket.io-client');
// import {io} from 'socket.io-client';
const socket = io("http://localhost:3000")

socket.on('connect', () => {
    //console.log("You connected with id: " + socket.id);
})

//testing
//socket.emit('custom-event', 10, 'Hi', {a: 'a'})

//client sends the opponent data to server
function sendUpdatedPlayerInfo(x, y, degree){
    socket.emit("opponent-update", (x/w), (y/h), degree);
}

//server sends the opponent data to client
socket.on('send-opponent-update', (x, y, degree) => {
    updateOpponentPlayer(x, y, degree);
})

function sendNewBulletToOpponent(x, y, life, xInc, yInc){
    socket.emit("bullet-update", (x/w), (y/h), life, xInc, yInc);
}

socket.on('send-bullet-update', (x, y, life, xInc, yInc) => {
    addOpponentBullet(x, y, life, xInc, yInc);
})
