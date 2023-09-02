import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";

interface ServerToClientEvents {
  reEntry: () => void;
  entry: ( playerNameList: string[] ) => void;
  gameStart: ( playerList: Player[], random: number[] ) => void;
}

interface ClientToServerEvents {
  sendName: ( inputName: string ) => void;
  pushGameStart: () => void;
}

type WordList = {
  random: number;
  vote: number;
}

class PlayerList {
  _list: Player[];
  _wordList: WordList[];

  constructor() {
    this._list = [];
    this._wordList = [];
  }

  get list(): Player[] {
    return this._list;
  }

  checkName( name: string ): boolean {
    return this._list.some( player => player.name === name );
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

  setOrder(): void {
    if ( this._list.filter( player => player.order === true ).length === 1 ) {
      let check = false
      for ( const player of this._list ) {
        if ( player.order === true ) {
          check = true;
          player.order = false;
          continue;
        }
        if ( check === true ) {
          player.order = true;
          break;
        }
      }
    } else {
      this._list.map( player => player.order = false );
      this._list[0].order = true;
    }
  }

  setWordList(): void {
    this._wordList = [];
    for ( let i = 0; i < 10; i++ ) {
      this._wordList.push( { random: Math.random(), vote: 0 } )
    }
  }

  getRandom(): number[] {
    const result: number[] = [];
    for ( const word of this._wordList ) {
      result.push( word.random );
    }
    return result;
  }
}

class Player {
  _socketID: string;
  _name: string;
  _order: boolean;

  constructor( socketID: string, name: string ) {
    this._socketID = socketID;
    this._name = name
    this._order = false;
  }

  set socketID( socketID: string ) {
    this._socketID = socketID;
  }
  set name( name: string ) {
    this._name = name;
  }
  set order( order: boolean ) {
    this._order = order;
  }

  get socketID(): string {
    return this._socketID;
  }
  get name(): string {
    return this._name;
  }
  get order(): boolean {
    return this._order;
  }
}

class Flag {
  _gameStart: boolean;

  constructor() {
    this._gameStart = false;
  }

  set gameStart( gameStart: boolean )  {
    this._gameStart = gameStart;
  }

  get gameStart(): boolean {
    return this._gameStart;
  }
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



// 定数
const playerList = new PlayerList();
const flag = new Flag();

io.on("connection", (socket) => {

  // 名前受信
  socket.on( 'sendName', ( inputName: string ) => {
    if ( playerList.checkName( inputName ) === true ) {
      io.to( socket.id ).emit( 'reEntry' );
    } else {
      const player = new Player( socket.id, inputName );
      playerList.setPlayer( player );
      io.emit( 'entry', playerList.getPlayerNameList() );
    }
  });

  // 切断時の処理
  socket.on( 'disconnect' , () => {
    playerList.removePlayer( socket.id );
    io.emit( 'entry', playerList.getPlayerNameList() );
  });

  // ゲーム開始
  socket.on( 'pushGameStart', () => {
    if ( flag.gameStart === true ) {
      return;
    } else {
      flag.gameStart = true;
      playerList.setOrder();
      playerList.setWordList();
      io.emit( 'gameStart', playerList.list, playerList.getRandom() );
    }
  });


});

