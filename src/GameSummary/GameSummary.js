import React, { Component } from 'react';

class GameSummary extends Component {
  constructor(props) {
    super(props)
    this.restartGame = this.restartGame.bind(this)
  }
  
  restartGame () {
    window.location.reload();
  }
  
  render() {
    return (
      <div className="App">
        <div> 
          The gyame has Ended. Press Start to Start Again
          {this.props.resultsArr}
          <button onClick={ this.restartGame }>Start</button> 
        </div> 
      </div>
    );
  }
}

export default GameSummary;
