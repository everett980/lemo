import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class GameStart extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.state.number} people are here</h1>
        </div>
        { this.leader ? <button></button> : null }
      </div>
    );
  }
}

export default App;
