
var canvasName = "notationCanvas";

VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById(canvasName)
var renderer = new VF.Renderer(div, VF.Renderer.Backends.CANVAS);

// Configure the rendering context.
renderer.resize(600, 500);
var context = renderer.getContext();
context.setFont("Arial", 10, "").setBackgroundFillStyle("#ccc");



// Create a stave of width 400 at position 10, 40 on the canvas.
var stave = new VF.Stave(20, 40, 500);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

var exercise = getExerciseNotes(); //pulls from the loaded js file
var notes = exercise.notes;
var beats = exercise.beats;

// Create a voice in 4/4 and add above notes
var voice = new VF.Voice({num_beats: beats,  beat_value: 4});
voice.addTickables(notes);


// Format and justify the notes to 400 pixels.
var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 450);

// Render voice
voice.draw(context, stave);

//animation?
var xToAnimateTo = voice.tickables[4].getAbsoluteX()

var topY = stave.getYForLine(0)
var bottomY = stave.getYForLine(4)
//var bottomY = stave.getBoundingBox().y + stave.height

function drawShape(){
  // get the canvas element using the DOM
  var canvas = document.getElementById(canvasName);

  // Make sure we don't execute when canvas isn't supported
  if (canvas.getContext) {

	   // use getContext to use the canvas for drawing
	   var ctx = canvas.getContext('2d');

	   // Stroked triangle
	   ctx.beginPath();
	   ctx.moveTo(xToAnimateTo,bottomY);
	   ctx.lineTo(xToAnimateTo,topY);
	   ctx.lineTo(45,bottomY);
	   ctx.closePath();
	   ctx.stroke();

  }
}

drawShape()