import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import GameStart from './GameStart/GameStart.js';
import WebcamWrapper from './Webcam/Webcam.js';
import GameSummary from './GameSummary/GameSummary.js'

class App extends Component {
  constructor(props) {
    console.log('app');
    super(props);
    this.socket = io.connect(); // eslint-disable-line
    this.state = {
      numPlayersConnected: 0,
      nextPlayer: false,
      gameStarted: false,
      endGame: false,
      resultsArr: null
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }));
    this.socket.on('start game', () => this.setState({ gameStarted: true }));
    this.socket.on('next player', () => this.setState({ nextPlayer: true }));
    this.socket.on('game over', (resultsArr) => this.setState({ endGame: true, resultsArr: resultsArr }));
    this.startGame = this.startGame.bind(this);
    this._sendEmotion = this._sendEmotion.bind(this);
  }

  _sendEmotion(data) {
    this.setState({ gameStarted: false });
    this.socket.emit('submit data', data);
  }

  startGame() {
    this.setState({ gameStarted: true });
    this.socket.emit('start game');
    console.log('starting game!');
  }
  //Renders Game Statuses at the top of the page
  renderGameHint() {
    if(!this.state.endGame) {
      if (this.state.nextPlayer) {
        return <div>You're Up Next</div>
      } else if (!this.state.gameStarted) {
        return <div>Waiting for First Player to Start</div>
      } else {
        return <div>Hold On... Another Player is Going</div>
      }
    } 
  
  }
  render() {
    return (
      <div className="App">
        { !this.state.gameStarted && !this.state.endGame && 
          <span>
            <p className="App-intro">
              { this.renderGameHint() }
            </p>
            <GameStart numPeeps={this.state.numPlayersConnected} startGame={this.startGame} />
          </span>
        }
        { this.state.endGame && <GameSummary resultsArr={this.state.resultsArr}></GameSummary> }
        <WebcamWrapper sendEmotion={this._sendEmotion} showClass={this.state.gameStarted} /> 
      </div>
    );
  }
}

export default App;
