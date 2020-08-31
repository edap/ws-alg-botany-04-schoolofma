var max_number_of_points = 4800;
var n = 0;
var c = 5;
var start = 0;

function setup(){
  createCanvas(800, 800);
  colorMode(HSB);
  angleMode(DEGREES);
  background(25, 204, 100);
}

function draw(){
  translate(width / 2, height / 2);
  for (var i =0; i < n; i++){
    //start = 0;
    // Algorithm!
    var a = i * 137.5;
    var r = c * sqrt(i);

    // conversion from polar coordinates system to cartesian coordinates
    var x = r * cos(a);
    var y = r * sin(a);

    // 1
    var hue = sin(start+ i * 0.5);
    hue = map(hue, -1, 1, 0, 255);
    // fill(a%255, 255, 255);
    fill(hue, 255, 255);
    ellipse(x, y, 4,4);
    noStroke();
  }
  if(i < max_number_of_points){
    n+= 5;
    start+= 5;
  }
}