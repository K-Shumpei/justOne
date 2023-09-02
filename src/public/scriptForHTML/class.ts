class PlayerList {
  _list: Player[];

  constructor() {
    this._list = []
  }

  set list( list: Player[] ) {
    this._list = list;
  }

  get list(): Player[] {
    return this._list;
  }

  setPlayer( player: Player ): void {
    this._list.push( player );
  }

  getMyName(): string {
    return this._list.filter( player => player.isMe )[0].name;
  }

  setMyOrder( order: boolean ): void {
    for ( const player of this._list ) {
      if ( player.isMe === true ) {
        player.order = order;
      }
    }
  }

  alertMaster( name: string ): void {
    for ( const player of this._list ) {
      if ( player.name === name && player.order === true ) {
        alert( 'あなたは回答者です、ヒントが揃うまでお待ちください。' );
      }
    }
  }
}

class Player {
  _name: string;
  _order: boolean;
  _isMe: boolean;

  constructor( name: string ) {
    this._name = name
    this._order = false;
    this._isMe = false;
  }

  set name( name: string ) {
    this._name = name;
  }
  set order( order: boolean ) {
    this._order = order;
  }
  set isMe( isMe: boolean ) {
    this._isMe = isMe;
  }

  get name(): string {
    return this._name;
  }
  get order(): boolean {
    return this._order;
  }
  get isMe(): boolean {
    return this._isMe;
  }
}
