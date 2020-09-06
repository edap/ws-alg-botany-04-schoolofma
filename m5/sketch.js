// Source https://learn.ml5js.org/docs/#/tutorials/hello-ml5
// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

function preload() {
    // What is MobileNet? What is a model? how is a model build?
    // Be critical! what are the motivation behind the model? which
    // data were used? how and why?
    classifier = ml5.imageClassifier('MobileNet');
    img = loadImage('images/bird.jpg');
}

function setup() {
    createCanvas(400, 400);
    // What is a classifier?
    // What is a callback, what is a promise in javascript?
    classifier.classify(img, gotResult);
    image(img, 0, 0);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
    console.log(classifier);
    // Display error in the console
    if (error) {
        console.error(error);
    } else {
        // The results are in an array ordered by confidence.
        console.log(results);
        createDiv(`Label: ${results[0].label}`);
        createDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
    }
}