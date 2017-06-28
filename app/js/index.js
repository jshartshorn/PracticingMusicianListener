var canvasName = "notationCanvas";
var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas";

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

var ListenerApp = function() {
    this.scoreUtil = null

    this.runApp = function() {

        this.generatedExercise = generateExerciseForKotlin()

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)

        PracticingMusician.app.exerciseManager.loadExercise()

        this.makeScore()
    }

    this.makeScore = function() {
        this.scoreUtil = new EasyScoreUtil()

        var exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

        //make sure it has a reference to the loaded exercise
        this.scoreUtil.exercise = exercise
        this.scoreUtil.generatedExercise = this.generatedExercise

        //setup the score
        this.scoreUtil.setupOnElement("notationBody")

        //notate it
        this.scoreUtil.notateExercise()
    }

    this.doResizeActions = function() {
        pm_log("Resized window",10)

        var oldSVG = document.getElementsByTagName("svg")[0]
        oldSVG.parentNode.removeChild(oldSVG)

        this.makeScore()
    }

    //move the indicator to a certain beat position
    this.moveToPosition = function(beat) {
        //clear the previous indicator first
        indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
        this.scoreUtil.drawIndicatorLine(indicatorCanvas, beat)
    }

    //highlight a certain item in the HTML metronome indicators
    this.highlightMetronomeItem = function(itemNumber) {
        for (index in metronomeItems) {
            var item = metronomeItems[index]
            item.className = "metronomeItem"

            if (itemNumber == index)
                item.className += " highlighted"
        }
    }

    //clear existing feedback items from the screen
    this.clearFeedbackItems = function() {
        pm_log("Clearing")
        feedbackCanvas.getContext("2d").clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)

        var items = document.getElementsByClassName('feedbackItem');
        while(items[0]) {
            items[0].parentNode.removeChild(items[0])
        }
    }

    //add a feedback item to a certain beat
    this.addFeedbackItem = function(beat,items) {
        var positionForBeat = this.scoreUtil.getPositionForBeat(beat)
        var positionY = this.scoreUtil.getFeedbackYPosition(positionForBeat.y)
        //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
        this.scoreUtil.createFeedbackHTMLElement(items.toArray(),positionForBeat.x,positionY)
    }
}

var listenerApp = new ListenerApp()
listenerApp.runApp()


//Resizing code
var resizeTimeoutID;
window.onresize = function() {
    clearTimeout(resizeTimeoutID);
    resizeTimeoutID = setTimeout(doResizeActions, 500);
}




//global variables for the different canvases
var canvas = document.getElementById(canvasName);
var indicatorCanvas = document.getElementById(indicatorCanvasName);
var feedbackCanvas = document.getElementById(feedbackCanvasName);

//references to the HTML metronome indicators
var metronomeItems = document.getElementById("metronomeItems").getElementsByClassName("metronomeItem");
