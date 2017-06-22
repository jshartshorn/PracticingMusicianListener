
VF = Vex.Flow;


var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";

var context = VexFlowUtil.setupCanvas(document.getElementById(canvasName));

// Configure the rendering context.
//renderer.resize(600, 500);

var staveWidth = 600;

var stave = VexFlowUtil.createStave(staveWidth);

// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();




var exercise = getExerciseNotes(); //pulls from the loaded js file

var voice = VexFlowUtil.inputExercise(context, stave, exercise);

//animation?

var indicatorItem = voice.tickables[6]

var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);

//VexFlowUtil.drawIndicatorLine(canvas, stave, indicatorItem.getAbsoluteX())

VexFlowUtil.animateIndicatorLine(indicatorCanvas,stave,voice.tickables[0],voice.tickables[2],1000)