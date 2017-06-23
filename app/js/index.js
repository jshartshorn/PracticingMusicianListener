
VF = Vex.Flow;

function concat(a, b) { return a.concat(b); }

var exercise = getExerciseNotes(); //pulls from the loaded js file




var vf = new Vex.Flow.Factory({
        renderer: {selector: 'notationWindow', width: 1100, height: 900}
        });

var registry = new VF.Registry();
VF.Registry.enableDefaultRegistry(registry);

var score = vf.EasyScore({ throwOnError: true });

var voice = score.voice.bind(score);
var notes = score.notes.bind(score);
var beam = score.beam.bind(score);



score.set({ time: '4/4' });

for (barIndex in exercise.bars) {
    console.log("Making bar...")

    var system = EasyScoreUtil.makeSystem(160);

    var bar = exercise.bars[barIndex]

    console.log("Content: ")
    console.log(bar)

    var notesString = bar.join(",")

    console.log(notesString)

    system.addStave({ voices: [voice(notes(notesString))] });
}

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

vf.draw();
VF.Registry.disableDefaultRegistry();


//animation?

var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");

//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[0],"^")
//VexFlowUtil.drawFeedbackOnTickable(feedbackCanvas,voice.tickables[1],"-")