import React, { Component } from 'react';
import Webcam from 'react-webcam';

export default class WebcamWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { screenshot: null, showWebcam: true };

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
      }, () => {
        console.log(this.state);
        const screenshotCanvas = document.getElementById('screenshot-canvas');
        screenshotCanvas.getContext("2d").putImageData(this.state.image, 0, 0);
        if (!faces.length) {
          this.setState({ retake: true });
          return;
        }
        const { emotions } = faces[0];
        console.log(emotions);
        let highest;
        let second;
        Object.keys(emotions).forEach(emotion => {
          if (emotion === 'engagement') return;
          console.log(emotion, emotions[emotion]);
          const val = emotions[emotion];
          if (highest && val > emotions[highest] || !highest) {
            second = highest;
            highest = emotion;
          } else if (!second || (second && val > emotions[second])) {
            second = emotion;
          }
          console.log(highest, second);
        });
        const highestTwo = {
          [highest]: emotions[highest],
          [second]: emotions[second]
        };
        console.log(highestTwo);
        this.props.sendEmotion([image, highestTwo]);
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
    canvas.height = 480;
    canvas.width = 640;
    var context = canvas.getContext('2d');
    // var img = document.getElementById('someImageId');
    // context.drawImage(img, 0, 0 );
    // var theData = context.getImageData(0, 0, img.width, img.height);
    // this.detector.process(theData, 0);

    var img = new Image;
    img.onload = () => {
      console.log('inside img.onload', img.width, img.height);
      context.drawImage(img,0,0); // Or at whatever offset you like
      var theData = context.getImageData(0, 0, img.width, img.height);
      console.log('theData', theData);
      this.detector.process(theData, 0);
    };
    img.src = image;

    this.setState({
      screenshot: image
    });
  }

  render() {
    console.log('webcam');
    return (
      <div className={`App show-${this.props.showClass}`}>
        <div className="App-header">
          <h1>{this.props.word}</h1>
        </div>
        {this.state.showWebcam ?
          (<div className="webcam-area">
            { this.state.retake && <h1>No face found, please retake!</h1> }
            <Webcam audio={false} ref="webcam"/>
          <button onClick={this.processPhoto}>Take Photo</button>
          </div>)
         : "Loading webcam..." }
         <canvas className="show-false" id="screenshot-canvas" height="480" width="640">
         </canvas>
      </div>
    );
  }
}
