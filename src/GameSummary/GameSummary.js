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
        <ul className="collection">
          { this.props.resultsArr.sort().reverse().map(([imgUri, _, score], idx ) => (
            <li className="collection-item avatar">
              <img src={imgUri} className="circle" />
              <span className="title">{ idx === 1 ? "1st" : idx === 2 ? "2nd" : idx === 3 ? "3rd" : idx + "th" }</span>
              <p>{ score }</p>
              <a className="secondary-content"><i className="material-icons">grade</i></a>
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
