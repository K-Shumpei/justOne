"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
class PlayerList {
    constructor() {
        this._list = [];
        this._wordList = [];
    }
    get list() {
        return this._list;
    }
    checkName(name) {
        return this._list.some(player => player.name === name);
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
    setOrder() {
        if (this._list.filter(player => player.order === true).length === 1) {
            let check = false;
            for (const player of this._list) {
                if (player.order === true) {
                    check = true;
                    player.order = false;
                    continue;
                }
                if (check === true) {
                    player.order = true;
                    break;
                }
            }
        }
        else {
            this._list.map(player => player.order = false);
            this._list[0].order = true;
        }
    }
    setWordList() {
        this._wordList = [];
        for (let i = 0; i < 10; i++) {
            this._wordList.push({ random: Math.random(), vote: 0 });
        }
    }
    getRandom() {
        const result = [];
        for (const word of this._wordList) {
            result.push(word.random);
        }
        return result;
    }
}
class Player {
    constructor(socketID, name) {
        this._socketID = socketID;
        this._name = name;
        this._order = false;
    }
    set socketID(socketID) {
        this._socketID = socketID;
    }
    set name(name) {
        this._name = name;
    }
    set order(order) {
        this._order = order;
    }
    get socketID() {
        return this._socketID;
    }
    get name() {
        return this._name;
    }
    get order() {
        return this._order;
    }
}
class Flag {
    constructor() {
        this._gameStart = false;
    }
    set gameStart(gameStart) {
        this._gameStart = gameStart;
    }
    get gameStart() {
        return this._gameStart;
    }
}
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
// 定数
const playerList = new PlayerList();
const flag = new Flag();
io.on("connection", (socket) => {
    // 名前受信
    socket.on('sendName', (inputName) => {
        if (playerList.checkName(inputName) === true) {
            io.to(socket.id).emit('reEntry');
        }
        else {
            const player = new Player(socket.id, inputName);
            playerList.setPlayer(player);
            io.emit('entry', playerList.getPlayerNameList());
        }
    });
    // 切断時の処理
    socket.on('disconnect', () => {
        playerList.removePlayer(socket.id);
        io.emit('entry', playerList.getPlayerNameList());
    });
    // ゲーム開始
    socket.on('pushGameStart', () => {
        if (flag.gameStart === true) {
            return;
        }
        else {
            flag.gameStart = true;
            playerList.setOrder();
            playerList.setWordList();
            io.emit('gameStart', playerList.list, playerList.getRandom());
        }
    });
});
