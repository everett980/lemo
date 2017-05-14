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
            <p className="App-intro">good job you!</p>
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
