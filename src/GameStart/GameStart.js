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
          <button className="start-button" onClick={ this.props.startGame }>Start</button> 
          <div>
            <p>Share this url with your friends!</p>
            <p>{ this.urlStart }/{ Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) }</p>
          </div>
        </div>
      </div>
    );
  }
}
