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

    socket.on("join", (data) => {
        // Emit a welcome message to the user who joined
        socket.emit("message", { text: `Welcome, ${data.username}!` });

        // Broadcast a message to all other users in the same room
        socket.broadcast.to(data.room).emit("message", {
            text: `${data.username} has joined the room.`
        });

        // Join the room
        socket.join(data.room);
    });

    socket.on("sendMessage", async (data) => {

        // write your code here

        // Broadcast the received message to all users in the same room
        io.to(data.room).emit("message", {
            username: data.username,
            text: data.message
        });
    });

    socket.on('disconnect', () =>{
        console.log("Connection is disconnected");
    })
} );

server.listen(3200, ()=>{console.log("Server is listening on 3200");})