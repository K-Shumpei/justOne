import { METHODS } from "http";
import { io, Socket } from "socket.io-client";



interface ServerToClientEvents {
  entry: ( playerNameList: string[] ) => void;
}

interface ClientToServerEvents {
  sendName: ( inputName: string ) => void;
  gameStart: () => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
//const socket = (0, io)();

// プレイヤー名送信
function sendName(): void {
  const inputName: string = getHTMLInputElement( 'inputName' ).value;
  socket.emit( 'sendName', inputName );
}

// ゲーム画面へ進む
socket.on( 'entry', ( playerNameList: string[] ) => {
  getHTMLInputElement( 'nameField' ).style.display = 'none';
  getHTMLInputElement( 'entryNameField' ).style.display = 'block';
  getHTMLInputElement( 'entryName' ).textContent = playerNameList.join('、');
});

// ゲーム開始ボタン
function gameStart(): void {
  socket.emit( 'gameStart' );
}
