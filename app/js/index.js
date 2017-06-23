
var exercise = getExerciseNotes(); //pulls from the loaded js file


EasyScoreUtil.setupOnElement("notationWindow")

EasyScoreUtil.notateExercise(exercise)

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


//animation?

var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");

//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[0],"^")
//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[1],"-")