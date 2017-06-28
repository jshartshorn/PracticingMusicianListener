package com.practicingmusician

import app
import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.steppable.TimeKeeper
import org.w3c.dom.HTMLElement
import org.w3c.dom.get
import kotlin.browser.document

/**
 * Created by jn on 6/5/17.
 */

class App {
    val audioManager = AudioManager()

    var exerciseManager = ExerciseManager(audioManager)


    /*
      This should be called by a button on the UI

      If the timeKeeper is currently stopped (including on first run), the exerciseManager is set up, and then run

      If the timeKeeper is running, the manager is stopped (which also triggers the finishedActions
     */

    @JsName("toggleState")
    fun toggleState() {
        when (exerciseManager.timeKeeper.state) {
            TimeKeeper.TimeKeeperState.Stopped -> {
                exerciseManager.createSteppables()
                exerciseManager.setup()
                exerciseManager.loadExercise()

                exerciseManager.run()
            }
            TimeKeeper.TimeKeeperState.Running -> {
                exerciseManager.stop()
            }
        }
    }

}

external fun generateExerciseForKotlin() : GeneratedExercise
external fun generateExerciseEasyScoreCode() : dynamic
external var feedbackCanvas : dynamic
external var indicatorCanvas : dynamic
external var metronomeItems : Array<HTMLElement>

class ListenerApp {
    var scoreUtil = EasyScoreUtil()
    lateinit var generatedExercise : GeneratedExercise

    @JsName("runApp")
    fun runApp() {

        this.generatedExercise = generateExerciseForKotlin()

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)

        app.exerciseManager.loadExercise()

        this.makeScore()
    }

    fun makeScore() {
        this.scoreUtil = EasyScoreUtil()

        var exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

        //make sure it has a reference to the loaded exercise
        this.scoreUtil.exercise = exercise
        this.scoreUtil.generatedExercise = this.generatedExercise

        //setup the score
        this.scoreUtil.setupOnElement("notationBody")

        //notate it
        this.scoreUtil.notateExercise()
    }

    fun doResizeActions() {
        pm_log("Resized window",10)

        var oldSVG = document.getElementsByTagName("svg").get(0)
        oldSVG?.parentNode?.removeChild(oldSVG)

        this.makeScore()
    }

    //move the indicator to a certain beat position
    fun moveToPosition(beat : Double) {
        //clear the previous indicator first
        indicatorCanvas.getContext("2d").clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
        this.scoreUtil.drawIndicatorLine(indicatorCanvas, beat)
    }

    //highlight a certain item in the HTML metronome indicators
    fun highlightMetronomeItem(itemNumber : Int) {
        for (index in 0 until metronomeItems.size) {
            var item = metronomeItems[index]
            item.className = "metronomeItem"

            if (itemNumber == index)
                item.className = item.className + " highlighted"
        }
    }

    //clear existing feedback items from the screen
    fun clearFeedbackItems() {
        pm_log("Clearing")
        feedbackCanvas.getContext("2d").clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)

        val items = document.getElementsByClassName("feedbackItem")
        for (index in 0 until items.length) {
            val i = items.item(index)
            i?.parentNode?.removeChild(i)
        }
    }

    //add a feedback item to a certain beat
    fun addFeedbackItem(beat : Double,items : List<String>) {
        var positionForBeat = this.scoreUtil.getPositionForBeat(beat)
        var positionY = this.scoreUtil.getFeedbackYPosition(positionForBeat.y)
        //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
        this.scoreUtil.createFeedbackHTMLElement(items.toTypedArray(),positionForBeat.x,positionY)
    }
}