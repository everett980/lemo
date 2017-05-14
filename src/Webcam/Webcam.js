import React, { Component } from 'react';
import Webcam from 'react-webcam';

export default class WebcamWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { screenshot: null };

    var divRoot = document.getElementById("webcam");
    var width = 640;
    var height = 480;
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES; // eslint-disable-line
    //Construct a CameraDetector and specify the image width / height and face detector mode.
    this.detector = new affdex.CameraDetector(divRoot, width, height, faceMode); // eslint-disable-line

    this.detector.addEventListener("onInitializeSuccess", function() {
      console.log('init success');
    });
    this.detector.addEventListener("onInitializeFailure", function() {
      console.log('init FAILED');
    });

    this.detector.addEventListener("onWebcamConnectSuccess",
      function () {
        console.log('it fucking worked');
      });
    this.detector.addEventListener("onWebcamConnectFailure",
      function () {
        console.log('wtf');
      });

    this.detector.detectAllExpressions();
    this.detector.detectAllEmotions();
    this.detector.detectAllEmojis();
    this.detector.detectAllAppearance();

    this.detector.start();
    this.processPhoto = this.processPhoto.bind(this);
  }

  processPhoto() {
    const image = this.refs.webcam.getScreenshot();
    this.setState({
      screenshot: image
    });
    console.log(this.state);
    this.detector.process(image);
  }

  render() {
    console.log('webcam');
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.props.word}</h1>
        </div>
        <Webcam audio={false} ref="webcam"/>
        <div id="webcam"></div>
        <button onClick={this.processPhoto}>Take Photo</button>
        { this.state.screenshot ? <img src={this.state.screenshot} /> : null }
      </div>
    );
  }
}
