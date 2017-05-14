import React, { Component } from 'react';

export default class GameStart extends Component {
  constructor(props) {
    super(props);
    this.urlStart ='';
  }

  render() {
    console.log(this.props.sendChat);
    return (
      <div className="App">
        <div className="App-header">
          <p>{ this.props.numPeeps += this.props.numPeeps === 1 ? ' person is here' : ' people are here' }</p>
        </div>
        <div className="App-body">
          {!this.props.gameStarted && <button className="btn waves-effect waves-indigo" onClick={ this.props.startGame }>Start</button>}a
        </div>
      </div>
    );
  }
}
