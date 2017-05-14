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
    this._sendEmotion = this._sendEmotion.bind(this);
  }

  _sendEmotion(data) {
    this.setState({ gameStarted: false });
    this.socket.emit('submit data', data);
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
      <div className="App container">
        { !this.state.gameStarted &&
          <span>
            <div className="App-header">
             <h1 className="App-logo">fwhisper</h1>
            </div>
            <p className="App-intro">
              to start fwhispering, invite your friends.
            </p>
            <GameStart numPeeps={this.state.numPlayersConnected} startGame={this.startGame} />
          </span>
        }
        <WebcamWrapper sendEmotion={this._sendEmotion} showClass={this.state.gameStarted} /> 
      </div>
    );
  }
}

export default App;
