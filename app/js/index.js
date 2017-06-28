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

var scoreUtil = null

function makeScore() {
    scoreUtil = new EasyScoreUtil()

    //make sure it has a reference to the loaded exercise
    scoreUtil.exercise = exercise

    //setup the score
    scoreUtil.setupOnElement("notationBody")

    //notate it
    scoreUtil.notateExercise()
}

makeScore()

//Resizing code
var resizeTimeoutID;
window.onresize = function() {
    clearTimeout(resizeTimeoutID);
    resizeTimeoutID = setTimeout(doResizeActions, 500);
}

function doResizeActions() {
        pm_log("Resized window",10)

        var oldSVG = document.getElementsByTagName("svg")[0]
        oldSVG.parentNode.removeChild(oldSVG)

        makeScore()
}


//global variables for the different canvases
var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

//references to the HTML metronome indicators
var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");
