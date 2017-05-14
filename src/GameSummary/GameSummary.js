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
    const images = this.props.resultsArr.map(([imgUri, emotions, score, gifUrl], idx) =>
    <div className={`game-summary row ${idx%2 !== 0 ? 'alt-row' : null}`}>
        <div className="col s3">
          <img className="responsive-img" src={imgUri} />
        </div>
        <div className="col s2">
          <p className="emotions">
            <p className="emotions-title">Emotions</p>
            {emotions[0][0]}, {emotions[1][0]}
          </p>
        </div>
        <div className="col s3">
          <img className="responsive-img" src={gifUrl} />
        </div>
        <div className="col s4">
          <p className="score">
            <p className="score-title">Score</p>
            {score}
          </p>
        </div>
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
