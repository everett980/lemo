import React, { Component } from 'react';

export default class GameStart extends Component {
  constructor(props) {
    super(props);
    this.state = { leader: false };
    this.urlStart ='';
  }

  render() {
    console.log(this.props.sendChat);
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.props.numPeeps} people are here</h1>
        </div>
        <div className="App-body">
          { this.state.leader && <button onClick={this.props.sendChat}>Start</button> }
          { this.state.leader &&
              <div>
                <p>Share this url with your friends!</p>
                <p>{ this.urlStart }/{ Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) }</p>
              </div>
          }
          { this.state.leader
              ? <button className="isLeader" onClick={ () => this.setState({ leader: false }) }>I no longer want to lead</button>
              : <button className="isFollower" onClick={ () => { if (!this.state.leader) this.setState({ leader: true }) }}>I am the leader!</button>
          }
        </div>
      </div>
    );
  }
}
