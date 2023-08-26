import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

interface ServerToClientEvents {
  entry: ( playerNameList: string[] ) => void;
}

interface ClientToServerEvents {
  sendName: ( inputName: string ) => void;
  gameStart: () => void;
}

const app = express();
const httpServer = createServer( app );
const PORT = process.env.PORT || 3000;
const io = new Server<ClientToServerEvents, ServerToClientEvents>( httpServer );

// 公開フォルダの指定
app.use( express.static( __dirname + '/public') );

// サーバーを3000番ポートで起動
httpServer.listen( PORT, () => {
  console.log( `Server start on port ${PORT}.` );
});

class PlayerList {
  _list: Player[];

  constructor() {
    this._list = []
  }

  setPlayer( player: Player ): void {
    this._list.push( player );
  }

  getPlayerNameList(): string[] {
    const result: string[] = []
    for ( const player of this._list ) {
      result.push( player.name )
    }
    return result;
  }

  removePlayer( socketID: string ): void {
    this._list = this._list.filter( player => player.socketID !== socketID );
  }


}

class Player {
  _socketID: string;
  _name: string;

  constructor( socketID: string, name: string ) {
    this._socketID = socketID;
    this._name = name
  }

  set socketID( socketID: string ) {
    this._socketID = socketID;
  }

  get socketID(): string {
    return this._socketID;
  }
  get name(): string {
    return this._name;
  }
}


// 定数
const playerList = new PlayerList();

io.on("connection", (socket) => {

  // パスワード受信
  socket.on( 'sendName', ( inputName: string ) => {
    const player = new Player( socket.id, inputName );
    playerList.setPlayer( player );
    io.emit( 'entry', playerList.getPlayerNameList() );
  });

  // 切断時の処理
  socket.on( 'disconnect' , () => {
    playerList.removePlayer( socket.id );
    io.emit( 'entry', playerList.getPlayerNameList() );
  });

  // ゲーム開始
  socket.on( 'gameStart', () => {

  });


});

