/* GLOBALS */
var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas";

//global variables for the different canvases
var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

//references to the HTML metronome indicators
var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");

/* END GLOBALS */

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

var listenerApp = new PracticingMusician.com.practicingmusician.ListenerApp()

//Resizing code
var resizeTimeoutID;
window.onresize = function() {
    clearTimeout(resizeTimeoutID);
    resizeTimeoutID = setTimeout(doResizeActions, 500);
}
