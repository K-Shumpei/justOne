"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3000;
const io = new socket_io_1.Server(httpServer);
// 公開フォルダの指定
app.use(express_1.default.static(__dirname + '/public'));
// サーバーを3000番ポートで起動
httpServer.listen(PORT, () => {
    console.log(`Server start on port ${PORT}.`);
});
class PlayerList {
    constructor() {
        this._list = [];
    }
    setPlayer(player) {
        this._list.push(player);
    }
    getPlayerNameList() {
        const result = [];
        for (const player of this._list) {
            result.push(player.name);
        }
        return result;
    }
    removePlayer(socketID) {
        this._list = this._list.filter(player => player.socketID !== socketID);
    }
}
class Player {
    constructor(socketID, name) {
        this._socketID = socketID;
        this._name = name;
    }
    set socketID(socketID) {
        this._socketID = socketID;
    }
    get socketID() {
        return this._socketID;
    }
    get name() {
        return this._name;
    }
}
class BattlePlayerInfo {
    constructor() {
        this._socketID = '';
        this._battleOrder = [];
    }
    set socketID(socketID) {
        this._socketID = socketID;
    }
    set battleOrder(battleOrder) {
        this._battleOrder = battleOrder;
    }
    get socketID() {
        return this._socketID;
    }
    get battleOrder() {
        return this._battleOrder;
    }
}
const battleRoom = [];
// 定数
const password = '11111';
const playerList = new PlayerList();
io.on("connection", (socket) => {
    // パスワード受信
    socket.on('sendName', (inputName) => {
        const player = new Player(socket.id, inputName);
        playerList.setPlayer(player);
        io.emit('entry', playerList.getPlayerNameList());
    });
    // 切断時の処理
    socket.on('disconnect', () => {
        playerList.removePlayer(socket.id);
        io.emit('entry', playerList.getPlayerNameList());
    });
});
