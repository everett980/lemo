import React, { Component } from 'react';

export default class GameStart extends Component {
  constructor(props) {
    super(props);
    this.state = { number: 5, leader: 'lily' };
  }

  render() {
    console.log(this.props.sendChat);
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.state.number} people are here</h1>
        </div>
        { this.state.leader ? <button onClick={this.props.sendChat}>Start</button> : null }
      </div>
    );
  }
}
