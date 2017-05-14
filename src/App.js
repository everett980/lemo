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
      resultsArr: null,
      nextPrompt: null
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }));
    this.socket.on('start game', (prompt) => this.setState({ gameStarted: true, nextPrompt: prompt }));
    this.socket.on('start game', () => this.setState({ gameStarted: true }, () => console.log('enabling webcam')));
    this.socket.on('next player', () => this.setState({ nextPlayer: true }));
    this.socket.on('game over', (resultsArr) => this.setState({ endGame: true, resultsArr: resultsArr }));
    this.startGame = this.startGame.bind(this);
    this.renderGameHint = this.renderGameHint.bind(this);
    this.renderGamePrompt = this.renderGamePrompt.bind(this);
    this._sendEmotion = this._sendEmotion.bind(this);
  }

  _sendEmotion(data) {
    this.setState({ gameStarted: false });
    this.socket.emit('submit data', data);
  }

  startGame() {
    this.socket.emit('start game');
    console.log('starting game!');
  }
  //Renders Game Statuses at the top of the page
  renderGameHint() {
    if(!this.state.endGame) {
      if (this.state.nextPlayer) {
        return <p>you're next</p>
      } else if (!this.state.gameStarted) {
        return <p>waiting to start</p>
      } else {
        return <p>the game is afoot</p>
      }
    }
  }
   
  renderGamePrompt() {
    if(this.state.nextPrompt) {
      return <p> Try to Make a {this.state.nextPrompt[0][0]} and {this.state.nextPrompt[1][0]} face</p>
    }
  }
  
  render() {
    return (
      <div className="App container">
        { !this.state.gameStarted && !this.state.endGame &&
          <span>
            <div className="App-header">
             <h1 className="App-logo">fwhisper</h1>
            </div>
            <p className="App-intro">
              to start fwhispering, invite your friends.
            </p>
            { this.renderGameHint() }
            <GameStart gameStarted={this.state.gameStarted} numPeeps={this.state.numPlayersConnected} startGame={this.startGame} />
          </span>
        }
        { this.renderGamePrompt() }
        { this.state.endGame && <GameSummary resultsArr={this.state.resultsArr}></GameSummary> }
        <WebcamWrapper sendEmotion={this._sendEmotion} showClass={this.state.gameStarted} /> 
      </div>
    );
  }
}

export default App;
