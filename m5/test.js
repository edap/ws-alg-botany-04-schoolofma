let classifier;
let img;

function preload() {
    classifier = ml5.imageClassifier('MobileNet');
    img = loadImage('images/forcello.jpg');
}

function setup() {
    createCanvas(800, 800);
    classifier.classify(img, gotResult);
    image(img, 0, 0);
}

function gotResult(error, results) {
    console.log(results);
    if (error) {
        console.log(error);
    } else {
        createDiv(results[0].label);
    }
}