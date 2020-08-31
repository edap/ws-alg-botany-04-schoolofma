var angle;
var axiom = "F";
var sentence = axiom;
var len = 200;
var limit = 6;
var dec_percent = 0.7;

var rules = [];
rules[0] = {
  a: "F",
  b: "FF-[-F+F+F]+[+F-F-F]"
}

// rules[0] = {
//   a: "X",
//   b: "F[+X]F[-X]+X"
// }
// rules[1] = {
//   a: "F",
//   b: "FF"
// }

function generate(){
  if (limit === 0){ return; }
  len *= 0.5;
  var nextSentence = "";
  for(var i =0; i< sentence.length; i++){
    var current = sentence.charAt(i);
    var found = false;
    for(var j = 0; j < rules.length; j++){
      if(current == rules[j].a){
        found = true;
        nextSentence += rules[j].b
        break;
      }
    }
    if (!found){
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  createP(sentence);
  turtle();
  limit -= 1;
}

function turtle(){
  background(51);
  resetMatrix();
  translate(width/2, height);
  stroke(255,100);
  //strokeWeight(limit*2.0);
  // sentence = "F+-[]"
  for(var i = 0; i < sentence.length; i++){
    var current = sentence.charAt(i);
    if(current == "F"){
      line(0,0, 0, -len);
      translate(0,-len);
    }else if (current == "+"){
      rotate(angle);//right
    }else if (current == "-"){
      rotate(-angle);//left
    }else if (current == "["){
      push();
    }else if (current == "]"){
      pop();
    }
  }
}

function setup(){
  createCanvas(800,800);
  angle = radians(22.5);
  background(51);
  createP(axiom);
  turtle();
  var button = createButton("generate");
  button.mousePressed(generate);
}