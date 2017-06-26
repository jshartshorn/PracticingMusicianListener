var generatedExercise = null

generatedExercise = generateExerciseForKotlin()
PracticingMusician.app.exerciseManager.loadExercise()

var exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

//setup the score
EasyScoreUtil.setupOnElement("notationWindow")

//make sure it has a reference to the loaded exercise
EasyScoreUtil.exercise = exercise

//notate it
EasyScoreUtil.notateExercise()

///*  Measure 1 */
//var system = EasyScoreUtil.makeSystem(220);
//
//system.addStave({
//        voices: [
//          voice([
//            notes('D5/q[id="m1a"], C4, E5, G4'),
//            //beam(notes('G4/8, A4, B4, C5, D5, C4', { stem: 'up' })),
//          ].reduce(concat)),
//        ],
//      })
//        .addClef('treble')
//        .addKeySignature('G')
//        .addTimeSignature('4/4')
//
//
///* measure 2 */
//
//system = EasyScoreUtil.makeSystem(150);
//system.addStave({ voices: [voice(notes('D5/q[id="m2a"], G4[id="m2b"], G4[id="m2c"], G5'))] });


//global variables for the different canvases
var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

//references to the HTML metronome indicators
var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");

//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[0],"^")
//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[1],"-")