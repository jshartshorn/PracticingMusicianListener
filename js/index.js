
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

function moveToPosition(beat) {
    indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
    VexFlowUtil.drawIndicatorLine(indicatorCanvas, stave, VexFlowUtil.getPositionForBeat(voice.tickables, beat))
}

