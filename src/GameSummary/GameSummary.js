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
    const images = this.props.resultsArr.map(([imgUri, emotions, score, gifUrl]) => <div>
      <img src={imgUri} />
      <span>Emotions: {emotions[0][0]}{emotions[1][0]}</span>
      <img src={gifUrl} />
      <span>Score: {score}</span>
    </div>
    );
    return (
      <div className="App">
        <div className="row">
          <div className="col s12">
            <p className="App-logo">GAME OVER</p>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            {images}
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <button className="btn waves-effect waves-indigo" onClick={ this.restartGame }>again?</button> 
          </div>
        </div>
      </div>
    );
  }
}

export default GameSummary;
