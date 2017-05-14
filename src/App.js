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
      nextPlayer: false,
      gameStarted: false,
      endGame: false
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }));
    this.socket.on('start game', () => this.setState({ gameStarted: true }));
    this.socket.on('next player', () => this.setState({ nextPlayer: true }));
    this.socket.on('game over', () => this.setState({ endGame: true }));
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
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

  restartGame() {
    window.location.reload();
  }
  
  startGame() {
    this.setState({ gameStarted: true });
    this.socket.emit('start game');
    console.log('starting game!');
  }

  render() {
    return (
      <div className="App">
        { !this.state.gameStarted && !this.state.endGame && 
          <span>
            <p className="App-intro">
              { this.state.nextPlayer && !this.state.endGame ? 'You\'re Up next' : 'Hold on... Another Player is Going' }
            </p>
            <GameStart numPeeps={this.state.numPlayersConnected} startGame={this.startGame} />
          </span>
        }
        { 
          this.state.endGame && 
          <div> 
            The gyame has Ended. Press Start to Start Again 
            <button onClick={ this.restartGame }>Start</button> 
          </div> 
        }
        <WebcamWrapper sendEmotion={this._sendEmotion} showClass={this.state.gameStarted} /> 
      </div>
    );
  }
}

export default App;
