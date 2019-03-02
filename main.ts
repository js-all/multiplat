import socket from 'socket.io';
import express from 'express';
import http from 'http';
import fs from 'fs';

const app = express();
const server = new http.Server(app);
const io = socket(server);
const players : Player[] = [];

interface Player {
    x: number, 
    y: number
}

app.use(express.static('./public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

server.listen(4042);

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
});

fs.readFile('./maps/map.json', (err, data) => {
    if(err) return
    console.log(data.toString());
    app.get('/map', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(data.toString());
    });
})

io.on('connection', socket => {
    socket.emit('ID', players.length);
});

