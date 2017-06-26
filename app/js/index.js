var generatedExercise = null

var UserSettings = {
    transposition: 0, //-2 would be Bb transposition
    tempo: -1, //-1 if we don't want to change the value
    applyToExercise: function(exerciseObject) {

        exerciseObject.notes = exerciseObject.notes.map(function(it) {
            if (UserSettings.transposition != 0)
                it.noteNumber += UserSettings.transposition

            return it
        })

        if (this.tempo != -1)
            exerciseObject.tempo = this.tempo

        return exerciseObject
    }
}

generatedExercise = generateExerciseForKotlin()

generatedExercise = UserSettings.applyToExercise(generatedExercise)

PracticingMusician.app.exerciseManager.loadExercise()

var exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

//make sure it has a reference to the loaded exercise
EasyScoreUtil.exercise = exercise

//setup the score
EasyScoreUtil.setupOnElement("notationBody")

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