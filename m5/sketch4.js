// Regression
// What is regression?
// Classification assigns labels to images. There are no "in betweens"
// like in the previous example, i can be happy or I can be sad
// Each image can go in one of the two, there are no other possibilities.
// A Regression it is a process for which I want to make a prediction for that image
// but I do not want to put in a bucket, I want a number that tells me from 0 to 1
// how happy or sad I am

// Feature Extractor Regression
// A Beginner's Guide to Machine Learning with ml5.js
// The Coding Train / Daniel Shiffman
// https://youtu.be/aKgq0m1YjvQ
// https://thecodingtrain.com/learning/ml5/3.2-feature-extractor-regression.html
// https://editor.p5js.org/codingtrain/sketches/


// usage:
// Move your head to the right, slider to 0, press add 20 times
// Move your head to the left, slider to 1, press add 20 times
// Move your head to the middle of the screen, slider to 0.5, press add 20 times
// press train

// Exercise. What videogame can you imagine?

let mobilenet;
let predictor;
let video;
let value = 0;
let slider;
let addButton;
let trainButton;

function modelReady() {
    console.log('Model is ready!!!');
}

function videoReady() {
    console.log('Video is ready!!!');
}

function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        predictor.predict(gotResults);
    } else {
        console.log(loss);
    }
}

function gotResults(error, result) {
    if (error) {
        console.error(error);
    } else {
        // updated to work with newer version of ml5
        // value = result;
        value = result.value;
        predictor.predict(gotResults);
    }
}

function setup() {
    createCanvas(320, 270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    predictor = mobilenet.regression(video, videoReady);

    slider = createSlider(0, 1, 0.5, 0.01);

    addButton = createButton('add example image');
    addButton.mousePressed(function () {
        // assign this image feature to the value in the slider
        predictor.addImage(slider.value());
    });

    trainButton = createButton('train');
    trainButton.mousePressed(function () {
        predictor.train(whileTraining);
    });
}

function draw() {
    background(0);
    image(video, 0, 0, 320, 240);
    rectMode(CENTER);
    fill(255, 0, 200);
    rect(value * width, height / 2, 50, 50);

    fill(255);
    textSize(16);
    text(value, 10, height - 10);
}
