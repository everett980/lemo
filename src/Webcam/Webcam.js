import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class GameStart extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.state.word}</h1>
        </div>
        {/* webcam footage goes fullcreen here */}
      </div>
    );
  }
}

export default App;
