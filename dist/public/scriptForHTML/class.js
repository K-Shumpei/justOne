"use strict";
class PlayerList {
    constructor() {
        this._list = [];
    }
    set list(list) {
        this._list = list;
    }
    get list() {
        return this._list;
    }
    setPlayer(player) {
        this._list.push(player);
    }
    getMyName() {
        return this._list.filter(player => player.isMe)[0].name;
    }
    setMyOrder(order) {
        for (const player of this._list) {
            if (player.isMe === true) {
                player.order = order;
            }
        }
    }
    alertMaster(name) {
        for (const player of this._list) {
            if (player.name === name && player.order === true) {
                alert('あなたは回答者です、ヒントが揃うまでお待ちください。');
            }
        }
    }
}
class Player {
    constructor(name) {
        this._name = name;
        this._order = false;
        this._isMe = false;
    }
    set name(name) {
        this._name = name;
    }
    set order(order) {
        this._order = order;
    }
    set isMe(isMe) {
        this._isMe = isMe;
    }
    get name() {
        return this._name;
    }
    get order() {
        return this._order;
    }
    get isMe() {
        return this._isMe;
    }
}
