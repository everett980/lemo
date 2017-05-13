import React, { Component } from 'react';
import Webcam from 'react-webcam';

export default class WebcamWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { screenshot: null };

    var faceMode = affdex.FaceDetectorMode.LARGE_FACES; // eslint-disable-line
    this.detector = new affdex.PhotoDetector(faceMode); // eslint-disable-line

    this.detector.addEventListener("onInitializeSuccess", function() {});
    this.detector.addEventListener("onInitializeFailure", function() {});

    this.detector.addEventListener("onImageResultsSuccess",
      function (faces, image, timestamp) {
        console.log('it fucking worked')
      });
    this.detector.addEventListener("onImageResultsFailure",
      function (image, timestamp, err_detail) {
        console.log('wtf')
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
        <button onClick={this.processPhoto}>Take Photo</button>
        { this.state.screenshot ? <img src={this.state.screenshot} /> : null }
      </div>
    );
  }
}
