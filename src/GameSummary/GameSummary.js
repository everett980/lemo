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
    console.log(this.props.resultsArr);
    console.log(this.props.resultsArr.map(([_, emotes]) => emotes));
    const images = this.props.resultsArr.map(([imgUri]) => <img src={imgUri} />);
    return (
      <div className="App">
        <div> 
          The game has Ended. Press Start to Start Again
          <button onClick={ this.restartGame }>Start</button> 
          {images}
        </div> 
      </div>
    );
  }
}

export default GameSummary;
