import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GameStart from './GameStart/GameStart.js';
import WebcamWrapper from './Webcam/Webcam.js';

class App extends Component {
  constructor(props) {
    console.log('app');
    super(props);
    this.socket = io.connect(); // eslint-disable-line
    this._sendChat = this._sendChat.bind(this);
    this.state = {
      numPlayersConnected: 0
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }))
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
        </div>
        <p className="App-intro">
          To start fwhispering, <code>src/App.js</code> and save to reload.
        </p>
        <GameStart sendChat={this._sendChat} numPeeps={this.state.numPlayersConnected}/>
        <WebcamWrapper />
      </div>
    );
  }
}

export default App;
