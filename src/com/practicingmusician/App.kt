package com.practicingmusician

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.finals.FeedbackItem
import com.practicingmusician.finals.FeedbackMetric
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper
import org.w3c.dom.Element
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.get
import kotlin.browser.document

/**
 * Created by jn on 6/5/17.
 */

external fun generateExerciseForKotlin() : GeneratedExercise
external fun generateExerciseEasyScoreCode() : EasyScoreCode
external var listenerApp : ListenerApp
external var audioAnalyzer : AudioAnalyzer


class ListenerApp {
    var scoreUtil = EasyScoreUtil()
    lateinit var generatedExercise : GeneratedExercise

    lateinit var notationContainerElementName : String
    lateinit var metronomeContainerElementName : String

    val audioManager = AudioManager()

    var exerciseManager = ExerciseManager(audioManager)

    @JsName("runApp")
    fun runApp(parameters: AppSetupParameters) {

        this.notationContainerElementName = parameters.notationContainerName
        this.metronomeContainerElementName = parameters.metronomeContainerName

        Note.createAllNotes()

        audioAnalyzer.setupMedia()

        this.generatedExercise = generateExerciseForKotlin()

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)

        this.exerciseManager.loadExercise()

        this.makeDomElements()
    }

    fun makeDomElements() {

        pm_log("Making window w/ container: " + this.notationContainerElementName,10)

        //alter the style of the container element
        val container = document.getElementById(this.notationContainerElementName) as HTMLElement
        container.className += "notationBodyContainer"

        //make the canvases
        val indicatorCanvasName = "indicatorCanvas"
        val indicatorCanvasObj = document.createElement("canvas") as HTMLElement
        indicatorCanvasObj.style.position = "absolute"
        indicatorCanvasObj.id = indicatorCanvasName
        document.getElementById(this.notationContainerElementName)?.appendChild(indicatorCanvasObj)

        val feedbackCanvasName = "feedbackCanvas"
        val feedbackCanvasObj = document.createElement("canvas") as HTMLElement
        feedbackCanvasObj.style.position = "absolute"
        feedbackCanvasObj.id = feedbackCanvasName
        document.getElementById(this.notationContainerElementName)?.appendChild(feedbackCanvasObj)

        this.makeScore(this.notationContainerElementName)

        //for testing
        //TODO: remove
            val feedbackItems = listOf(
                    FeedbackItem(1.0, listOf(FeedbackMetric("test","val"))),
                    FeedbackItem(2.0, listOf(FeedbackMetric("test","val"))),
                    FeedbackItem(3.0, listOf(FeedbackMetric("test","val")))
            )

            feedbackItems.forEach {
                    val beat = it.beat
                    //pm_log("Feedback item at $beat")
                    listenerApp.addFeedbackItem(beat,it.feedbackItemType)
            }
    }

    fun makeScore(containerElementName : String) {
        this.scoreUtil = EasyScoreUtil()
        this.scoreUtil.containerElementName = this.notationContainerElementName

        val exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

        //make sure it has a reference to the loaded exercise
        this.scoreUtil.exercise = exercise
        this.scoreUtil.generatedExercise = this.generatedExercise

        //setup the score
        this.scoreUtil.setupOnElement(containerElementName)

        this.scoreUtil.setupMetronome(this.metronomeContainerElementName)

        this.scoreUtil.buildTitleElements(containerElementName)

        //notate it
        this.scoreUtil.notateExercise()
    }

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

    @JsName("doResizeActions")
    fun doResizeActions() {
        pm_log("Resized window w/ container: " + this.notationContainerElementName,10)

        val oldSVG = document.getElementsByTagName("svg").get(0) as Element
        oldSVG.parentNode?.removeChild(oldSVG)

        listenerApp.makeScore(this.notationContainerElementName)
    }

    //move the indicator to a certain beat position
    fun moveToPosition(beat : Double) {
        //clear the previous indicator first
        val indicatorCanvas = document.getElementById("indicatorCanvas") as? HTMLCanvasElement
        indicatorCanvas?.getContext("2d").asDynamic().clearRect(0, 0, indicatorCanvas?.width, indicatorCanvas?.height);
        this.scoreUtil.drawIndicatorLine(indicatorCanvas, beat)
    }

    //highlight a certain item in the HTML metronome indicators
    fun highlightMetronomeItem(itemNumber : Int) {
        val metronomeItems = document.getElementsByClassName("metronomeItem")
        for (index in 0 until metronomeItems.length) {
            val item = metronomeItems[index] as HTMLElement
            item.className = "metronomeItem"

            if (itemNumber == index)
                item.className = item.className + " highlighted"
        }
    }

    //clear existing feedback items from the screen
    fun clearFeedbackItems() {
        pm_log("Clearing")
        //val feedbackCanvas = document.getElementById("feedbackCanvas") as? HTMLCanvasElement
        //feedbackCanvas?.getContext("2d").asDynamic().clearRect(0,0,feedbackCanvas?.width,feedbackCanvas?.height)

        val items = document.getElementsByClassName("feedbackItem")

        while(items.length > 0) {
            (items[0] as HTMLElement).let {
                it.parentNode?.removeChild(it)
            }
        }

    }

    //add a feedback item to a certain beat
    fun addFeedbackItem(beat : Double,items : List<FeedbackMetric>) {
        val positionForBeat = this.scoreUtil.getPositionForBeat(beat)
        //pm_log("Position for beat: ",10)
        //pm_log(positionForBeat,10)
        val positionY = this.scoreUtil.getFeedbackYPosition(positionForBeat.y)
        //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
        this.scoreUtil.createFeedbackHTMLElement(items.toTypedArray(),positionForBeat.x,positionY)
    }
}