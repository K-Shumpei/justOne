"use strict";

const socket = (0, io)();
// プレイヤー名送信
function sendName() {
    const inputName = getHTMLInputElement('inputName').value;
    socket.emit('sendName', inputName);
}
// ゲーム画面へ進む
socket.on('entry', (playerNameList) => {
    getHTMLInputElement('nameField').style.display = 'none';
    getHTMLInputElement('entryNameField').style.display = 'block';
    getHTMLInputElement('entryName').textContent = playerNameList.join('、');
});
