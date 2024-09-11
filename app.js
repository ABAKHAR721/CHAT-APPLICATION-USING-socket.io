const express=require('express');
const path=require('path');
const app=express();
const PORT=process.env.PORT || 4000
const server=app.listen(PORT,
    ()=>console.log(`💭 server on port ${PORT}`)
)


const io = require('socket.io')(server);




app.use(express.static(path.join(__dirname,'public')))

io.on('connection',onConnected)

const socketsConnected =new Set()

function onConnected(socket){
    // console.log(socket.id);
    socketsConnected.add(socket.id)
    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        // console.log('Socket disconnect',socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total',socketsConnected.size)
    })
    socket.on('message', (data) => {
        // console.log(data);  // Log the received message data on the server

        // Broadcast the message to all other clients except the sender
        socket.broadcast.emit('chat-message', data);
    });

    socket.on("feedback",(data)=>{
        socket.broadcast.emit('feedback', data);
    })

}
