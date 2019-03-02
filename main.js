"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = __importDefault(require("socket.io"));
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
var players = [];
app.use(express_1.default.static('./public'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.listen(4042);
app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});
fs_1.default.readFile('./maps/map.json', function (err, data) {
    if (err)
        return;
    console.log(data.toString());
    app.get('/map', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(data.toString());
    });
});
io.on('connection', function (socket) {
    socket.emit('ID', players.length);
});
