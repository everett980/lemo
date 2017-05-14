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
      numPlayersConnected: 0,
      gameStarted: false
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }));
    this.socket.on('start game', () => this.setState({ gameStarted: true }));
    this.startGame = this.startGame.bind(this);
  }

  _sendChat() {
    window.console.log('clicked');
    this.socket.emit('chat message', 'a message');
  }

  startGame() {
    this.setState({ gameStarted: true });
    this.socket.emit('start game', 'start game!');
    console.log('starting game!');
  }

  render() {
    return (
      <div className="App">

        { !this.state.gameStarted &&
          <span>
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <p className="App-intro">
              To start fwhispering, <code>src/App.js</code> and save to reload.
            </p>
            <GameStart numPeeps={this.state.numPlayersConnected} startGame={this.startGame} />
          </span>
        }

        { this.state.gameStarted && <WebcamWrapper /> }
      </div>
    );
  }
}

export default App;
