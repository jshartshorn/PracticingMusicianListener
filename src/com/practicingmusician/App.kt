package com.practicingmusician

import app
import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.steppable.TimeKeeper
import org.w3c.dom.Element
import org.w3c.dom.HTMLCanvasElement
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
external fun generateExerciseEasyScoreCode() : EasyScoreCode
external var feedbackCanvas : HTMLCanvasElement
external var indicatorCanvas : HTMLCanvasElement
external var metronomeItems : Array<HTMLElement>
external var listenerApp : ListenerApp

class ListenerApp {
    var scoreUtil = EasyScoreUtil()
    lateinit var generatedExercise : GeneratedExercise

    val containerElementName = "notationBody"

    @JsName("runApp")
    fun runApp() {

        this.generatedExercise = generateExerciseForKotlin()

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)

        app.exerciseManager.loadExercise()

        this.makeDomElements()
    }

    fun makeDomElements() {

        //make the canvases
        val indicatorCanvasName = "indicatorCanvas"
        val indicatorCanvasObj = document.createElement("canvas")
        indicatorCanvasObj.id = indicatorCanvasName
        document.getElementById(containerElementName)?.appendChild(indicatorCanvasObj)

        val feedbackCanvasName = "feedbackCanvas"
        val feedbackCanvasObj = document.createElement("canvas")
        feedbackCanvasObj.id = feedbackCanvasName
        document.getElementById(containerElementName)?.appendChild(feedbackCanvasObj)

        this.makeScore(containerElementName)
    }

    fun makeScore(containerElementName : String) {
        this.scoreUtil = EasyScoreUtil()

        val exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

        //make sure it has a reference to the loaded exercise
        this.scoreUtil.exercise = exercise
        this.scoreUtil.generatedExercise = this.generatedExercise

        //setup the score
        this.scoreUtil.setupOnElement(containerElementName)

        //notate it
        this.scoreUtil.notateExercise()
    }

    @JsName("doResizeActions")
    fun doResizeActions() {
        pm_log("Resized window",10)

        val oldSVG = document.getElementsByTagName("svg").get(0) as Element
        oldSVG.parentNode?.removeChild(oldSVG)

        listenerApp.makeScore(containerElementName)
    }

    //move the indicator to a certain beat position
    fun moveToPosition(beat : Double) {
        //clear the previous indicator first
        indicatorCanvas.getContext("2d").asDynamic().clearRect(0, 0, indicatorCanvas.width, indicatorCanvas.height);
        this.scoreUtil.drawIndicatorLine(indicatorCanvas, beat)
    }

    //highlight a certain item in the HTML metronome indicators
    fun highlightMetronomeItem(itemNumber : Int) {
        for (index in 0 until metronomeItems.size) {
            val item = metronomeItems[index]
            item.className = "metronomeItem"

            if (itemNumber == index)
                item.className = item.className + " highlighted"
        }
    }

    //clear existing feedback items from the screen
    fun clearFeedbackItems() {
        pm_log("Clearing")
        feedbackCanvas.getContext("2d").asDynamic().clearRect(0,0,feedbackCanvas.width,feedbackCanvas.height)

        val items = document.getElementsByClassName("feedbackItem")
        for (index in 0 until items.length) {
            val i = items.item(index)
            i?.parentNode?.removeChild(i)
        }
    }

    //add a feedback item to a certain beat
    fun addFeedbackItem(beat : Double,items : List<String>) {
        val positionForBeat = this.scoreUtil.getPositionForBeat(beat)
        val positionY = this.scoreUtil.getFeedbackYPosition(positionForBeat.y)
        //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
        this.scoreUtil.createFeedbackHTMLElement(items.toTypedArray(),positionForBeat.x,positionY)
    }
}