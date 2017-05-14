import React, { Component } from 'react';
import axios from 'axios'

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
      nextPrompt: null,
      gifUrl: null
    }
    this.socket.on('numPlayersConnected', currentNumPlayers => this.setState({ numPlayersConnected: currentNumPlayers }));
    this.socket.on('start game', (prompt) => this.setState({ gameStarted: true, nextPrompt: prompt }));
    this.socket.on('wait', () => this.setState({ waiting: true }));
    this.socket.on('next player', () => this.setState({ nextPlayer: true }));
    this.socket.on('game over', (resultsArr) => this.setState({ endGame: true, resultsArr: resultsArr }));
    this.startGame = this.startGame.bind(this);
    this.renderGameHint = this.renderGameHint.bind(this);
    this.renderGamePrompt = this.renderGamePrompt.bind(this);
    this._sendEmotion = this._sendEmotion.bind(this);
    this.getGiph = this.getGiph.bind(this);
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
        return <p>you're next</p>)
      } else if (this.state.waiting) {
        return <p>waiting for current player</p>
      } else if (!this.state.gameStarted) {
        return <p>waiting to start</p>
      } else {
        return <p>the game is afoot</p>
      }
    }
  }

  renderGamePrompt() {
    if(this.state.nextPrompt) {
      return <p> Try to Make a <img src={this.state.nextPrompt}/> face</p>
    }
  }

  getGiph (emotion) {
    console.log('hitting the giphy api')
    return axios.get(`http://api.giphy.com/v1/gifs/search?q=${emotion}&api_key=dc6zaTOxFJmzC`)
    .then(res=>{
      const gifCount = res.data.data.length
      const rand = Math.floor(Math.random()*gifCount)
      console.log('return gif data', res.data.data);
      console.log('rand', rand);
      const gifUrl = res.data.data[rand]['images']['fixed_height']['url']
      // this._sendEmotion(gifUrl)
      // this.setState({gifUrl: gifUrl })
      return gifUrl;
    })
    // .catch(err=>console.err('fails'))
  }

  render() {
    return (
      <div className="App container">
        { !this.state.endGame &&
          <span>
            <div className="App-header">
             <h1 className="App-logo">fwhisper</h1>
            </div>
            { !this.state.gameStarted && !this.state.waiting && <p className="App-intro">
              to start fwhispering, invite your friends.
            </p> }
            { this.renderGameHint() }
            { this.renderGamePrompt() }
            { !this.state.waiting && !this.state.gameStarted && <GameStart gameStarted={this.state.gameStarted} numPeeps={this.state.numPlayersConnected} startGame={this.startGame} /> }
          </span>
        }
        { this.state.endGame && <GameSummary resultsArr={this.state.resultsArr}></GameSummary> }

        <WebcamWrapper
          sendEmotion={this._sendEmotion}
          showClass={this.state.gameStarted}
          getGiph={this.getGiph}
          gif={this.state.gifUrl}
        />
      </div>
    );
  }
}

export default App;
