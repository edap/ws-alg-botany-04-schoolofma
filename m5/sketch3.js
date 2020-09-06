// Transfer learning
//  Most of the time you will be using a "pre-trained" model trained on a large dataset to classify an image into a fixed set of categories.
// However you can also use a part of the pre-trained model: the features.
// Those features allow you to 'retrain' or 'reuse' the model for a new custom task. This is known as Transfer Learning.

// Keywords: layers, features, and convolution


// Certain things were not properly recognized
// I can use other models to be more precise and retrain the mobileNet one


// What is a model? The mobileNet model is running a neural network.
// A NN is something that has multiple layers. Layer 1, 2, 3, 4, 5
// imagine those layers from left to right,
// The data move from the first layer on the left to the last on the right, remember the multilayer perceptron
// https://youtu.be/aircAruvnKk?t=145
// the data get processed. Those processes are different kind of processes
// One of those process is called a convulation, where the image get "reduced", eventually, to something called feature.
// A feature is just a bunch of numbers. This feature get processed one more time in another layer to get label and probablities, this process is called conversion
// The main idea of the feature is boiling image down to a small set of numbers.

// Transfer learning it is a process for which we skip the last part of the NN chain, that one were features get converted into labels and propbalities,
// and we work with the extracted features.

// how do we retrain a model to be more precise? we need to peel it and open it.
// We do this using a feature extractor, that it is something built into ml5.

// So, instead of making an image classifier with mobile net, we are going to make a feature extractor
// with mobileNet, and then turn the feature extractor into our own classifier and train it with our own images

// Main reference
//https://learn.ml5js.org/docs/#/reference/feature-extractor

// Feature Extractor Classification
// A Beginner's Guide to Machine Learning with ml5.js
// The Coding Train / Daniel Shiffman
// https://youtu.be/eeO-rWYFuG0
// https://thecodingtrain.com/learning/ml5/3.1-feature-extractor-classification.html
// https://editor.p5js.org/codingtrain/sketches/5A_TJHA1


// usage:
// make an appy face and press on happy 20 times
// make a sad face and press on sad 20 times
// press train

// result. your expressions are now classified.

let mobilenet;
let classifier;
let video;
let label = 'test';
let ukeButton;
let whistleButton;
let trainButton;
let saveButton;

function modelReady() {
    console.log('Model is ready!!!');
}

function videoReady() {
    console.log('Video is ready!!!');
}

function whileTraining(loss) {
    if (loss == null) {
        console.log('Training Complete');
        classifier.classify(gotResults);
    } else {
        console.log(loss);
    }
}

function gotResults(error, result) {
    if (error) {
        console.error(error);
    } else {
        // updated to work with newer version of ml5
        // label = result;
        label = result[0].label;
        classifier.classify(gotResults);
    }
}

function setup() {
    createCanvas(320, 270);
    video = createCapture(VIDEO);
    video.hide();
    background(0);
    mobilenet = ml5.featureExtractor('MobileNet', modelReady);
    classifier = mobilenet.classification(video, videoReady);

    ukeButton = createButton('happy');
    ukeButton.mousePressed(function () {
        classifier.addImage('happy');
    });

    whistleButton = createButton('sad');
    whistleButton.mousePressed(function () {
        classifier.addImage('sad');
    });

    trainButton = createButton('train');
    trainButton.mousePressed(function () {
        classifier.train(whileTraining);
    });

    // save models
    saveButton = createButton('save');
    saveButton.mousePressed(function () {
        // this gives me two files. weights.bin and json
        // model.json simply gives the configuration of the layers
        // the weights file contain the training process, that contains all the connections
        // between layers, features and labels.
        // put them in a folder and call it my-model
        classifier.save();
    });
}

function draw() {
    background(0);
    image(video, 0, 0, 320, 240);
    fill(255);
    textSize(16);
    text(label, 10, height - 10);
}
