import React, { Component } from 'react';
import Webcam from 'react-webcam';

export default class WebcamWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { screenshot: null, showWebcam: false };

    var divRoot = document.getElementById("webcam");
    var faceMode = affdex.FaceDetectorMode.LARGE_FACES; // eslint-disable-line
    this.detector = new affdex.PhotoDetector(faceMode);  // eslint-disable-line

    this.detector.addEventListener("onInitializeSuccess", () => {
      console.log('init success');
      this.setState({
        showWebcam: true
      });
    });
    this.detector.addEventListener("onInitializeFailure", function() {
      console.log('init failed')
    });

    this.detector.addEventListener("onImageResultsSuccess", (faces, image, timestamp) => {
      console.log('image results success', faces, image, timestamp);
      this.setState({
        faces,
        image,
        timestamp
      }, function() {
        var canvas = document.getElementById('new-id');
        var newCtx = canvas.getContext("2d");
        newCtx.putImageData(this.state.image, 0, 0);
      });
    });
    this.detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {
      console.log('image results failure', err_detail);
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
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    // var img = document.getElementById('someImageId');
    // context.drawImage(img, 0, 0 );
    // var theData = context.getImageData(0, 0, img.width, img.height);
    // this.detector.process(theData, 0);


    var img = new Image;
    img.onload = () => {
      console.log(img.width, img.height);
      context.drawImage(img,0,0); // Or at whatever offset you like
      var theData = context.getImageData(0, 0, img.width, img.height);
      this.detector.process(theData, 0);
    };
    img.src = image;



    this.setState({
      screenshot: image
    }, () => {
      console.log(this.state);
      var canvas = document.getElementById('screenshot-canvas');
      var ctx = canvas.getContext("2d");
      var imageDataWeHope = ctx.getImageData(0, 0, 1280, 960);
      console.log('image data we\'re sending', imageDataWeHope);
//      this.detector.process(imageDataWeHope, 0);
    });
  }

  render() {
    console.log('webcam');
    return (
      <div className="App">
        <div className="App-header">
          <h1>{this.props.word}</h1>
        </div>
        {this.state.showWebcam ?
          (<div className="webcam-area">
            <Webcam audio={false} ref="webcam"/>
          <button onClick={this.processPhoto}>Take Photo</button>
          </div>)
         : "Loading webcam..." }
         <canvas id="screenshot-canvas">
           { this.state.screenshot ? <img src={this.state.screenshot} /> : null }
         </canvas>
         <h1>FROM THE STATE!!!!</h1>
         <canvas id="new-id" height="480" width="640">
         </canvas>
      </div>
    );
  }
}
