// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Handpose example using p5.js
=== */

let video;
let hp;
let poses = [];
let brain;

let state = 'waiting';
let targetLabel;

function keyPressed() {
  if (key == '/') {
    brain.saveData();
    return console.log('saved');
  }
  targetLabel = key;
  if (state == 'waiting') {
    state = 'collecting';
  } else {
    state = 'waiting';
    console.log('not collecting');
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  hp = ml5.handPose(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected

  hp.on('pose', function (results) {
    poses = results;
    // console.log(poses)
  });
  // Hide the video element, and just show the canvas
  video.hide();

  let options = {
    inputs: 42,
    output: 36,
    task: 'classification',
    debug: true
  };

  brain = ml5.neuralNetwork(options);
}

function modelReady() {
  select('#status').html('Model Loaded');
  hp.singlePose();
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  trainDataHand();
}

function trainDataHand() {
  if (poses.length > 0 && state == 'collecting') {
    let inputs = [];

    let poseB = poses[0];
    for (let j = 0; j < poseB.landmarks.length; j++) {
      let keypointB = poseB.landmarks[j];
      inputs.push(keypointB[0], keypointB[1]);
    }

    let target = [targetLabel];
    brain.addData(inputs, target);
    console.log('collecting');
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    // let pose = poses[i].pose;
    // for (let j = 0; j < pose.keypoints.length; j++) {
    //   // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    //   let keypoint = pose.keypoints[j];
    //   // Only draw an ellipse is the pose probability is bigger than 0.2
    //   if (keypoint.score > 0.2) {
    //     fill(255, 0, 0);
    //     noStroke();
    //     ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    //   }
    // }
    let pose = poses[i];
    // console.log(pose);
    for (let j = 0; j < pose.landmarks.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.landmarks[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      // if (keypoint.score > 0.2) {
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      // }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let annotations = poses[i].annotations;
    // For every skeleton, loop through all body connections
    stroke(255, 0, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      // let partA = annotations.thumb[j][0];
      // let partB = annotations.thumb[j][1];
      line(
        annotations.thumb[j][0],
        annotations.thumb[j][1],
        annotations.thumb[j + 1][0],
        annotations.thumb[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(
        annotations.indexFinger[j][0],
        annotations.indexFinger[j][1],
        annotations.indexFinger[j + 1][0],
        annotations.indexFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(
        annotations.middleFinger[j][0],
        annotations.middleFinger[j][1],
        annotations.middleFinger[j + 1][0],
        annotations.middleFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(
        annotations.ringFinger[j][0],
        annotations.ringFinger[j][1],
        annotations.ringFinger[j + 1][0],
        annotations.ringFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(
        annotations.pinky[j][0],
        annotations.pinky[j][1],
        annotations.pinky[j + 1][0],
        annotations.pinky[j + 1][1]
      );
    }

    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.thumb[0][0],
      annotations.thumb[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.indexFinger[0][0],
      annotations.indexFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.middleFinger[0][0],
      annotations.middleFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.ringFinger[0][0],
      annotations.ringFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.pinky[0][0],
      annotations.pinky[0][1]
    );
  }
}
