import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GameStart from './GameStart/GameStart.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect(); // eslint-disable-line

    this._sendChat = this._sendChat.bind(this);
  }

  _sendChat() {
    window.console.log('clicked');
    this.socket.emit('chat message', 'a message');
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <GameStart sendChat={this._sendChat}/>
      </div>
    );
  }
}

export default App;
