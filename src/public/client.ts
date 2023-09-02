import { METHODS } from "http";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  reEntry: () => void;
  entry: ( playerNameList: string[] ) => void;
  gameStart: ( playerList: Player[], randoms: number[] ) => void;
}

interface ClientToServerEvents {
  sendName: ( inputName: string ) => void;
  pushGameStart: () => void;
  selectQuestion: ( select: { word: string, isChecked: boolean }[] ) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
//const socket = (0, io)();

const playerList = new PlayerList;



// プレイヤー名送信
function sendName(): void {
  getHTMLInputElement( 'nameField' ).style.display = 'none';
  const inputName: string = getHTMLInputElement( 'inputName' ).value;
  const player = new Player( inputName );
  player.isMe = true;
  playerList.setPlayer( player );
  socket.emit( 'sendName', inputName );
}

// プレイヤー名に重複があった場合
socket.on( 'reEntry', () => {
  playerList.list = [];
  alert( '名前が重複しています' );
  getHTMLInputElement( 'nameField' ).style.display = 'block';
});

// ゲーム画面へ進む
socket.on( 'entry', ( playerNameList: string[] ) => {
  getHTMLInputElement( 'entryNameField' ).style.display = 'block';
  getHTMLInputElement( 'entryName' ).textContent = playerNameList.join('、');
  getHTMLInputElement( 'gameStartButton' ).style.display = 'block';
});

// ゲーム開始ボタン
function gameStart(): void {
  getHTMLInputElement( 'gameStartButton' ).style.display = 'none';
  socket.emit( 'pushGameStart' );
}

// ゲーム開始
socket.on( 'gameStart', ( list: Player[], randoms: number[] ) => {
  getHTMLInputElement( 'gameStartButton' ).style.display = 'none';

  for ( const info of list ) {
    if ( info._name === playerList.getMyName() ) {
      playerList.setMyOrder( info._order );
    } else {
      const player = new Player( info._name );
      player.order = info._order;
      playerList.setPlayer( player );
    }
  }

  playerList.alertMaster( playerList.getMyName() );

  // お題選択肢
  for ( let i = 0; i < 10; i++ ) {
    getHTMLInputElement( `text${i}` ).textContent = wordList[Math.floor(randoms[i]*wordList.length)];
  }
});

// お題選択
function selectQuestion(): void {

  const select = [];
  for ( let i = 0; i < 10; i++ ) {
  }
}
