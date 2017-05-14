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
      <img src={gifUrl} />
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
        <ul className="collection colored">
          { this.props.resultsArr.sort().reverse().map(([imgUri, _, score], idx ) => (
            <li className="collection-item avatar">
              <img src={imgUri} className="circle" />
              <span className="title">{ idx + 1 === 1 ? "1st" : idx + 1 === 2 ? "2nd" : idx + 1 === 3 ? "3rd" : idx + 1 + "th" }</span>
              <p colored>{ score.toFixed(2) }%</p>
            </li>
            ))
          }
        </ul>
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
