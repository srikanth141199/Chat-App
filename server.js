import express from 'express';
import { Server } from 'socket.io';
import cors from "cors";
import http from "http";


const app = express();

const server = http.createServer(app);

//create Socket Server
const io = new Server(server, {
    cors:{
        origin:'*',
        methods:["GET", "POST"]
    }
});

//use socket event

io.on('connect',  (socket) =>{
    console.log("Connect is established");

    socket.on('join', (data) => {
        socket.username = data;
    })

    socket.on('new_message', (message)=>{
        let userMessage = {
            username: socket.username,
            message : message
        }

        //broadcast this message to users
        socket.broadcast.emit('broadcast_message', userMessage);

    })

    socket.on('disconnect', () =>{
        console.log("Connection is disconnected");
    })
} );

server.listen(3200, ()=>{console.log("Server is listening on 3200");})