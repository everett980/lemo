import React, { Component } from 'react';
import { Webcam as ReactWebcam } from 'react-webcam';

export default class Webcam extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.props.word}</h1>
        </div>
        <ReactWebcam />
        {/* webcam footage goes fullcreen here */}
      </div>
    );
  }
}
