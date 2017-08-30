package com.practicingmusician

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.finals.FeedbackItem
import com.practicingmusician.finals.FeedbackMetric
import com.practicingmusician.finals.FeedbackType
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper
import org.w3c.dom.Element
import org.w3c.dom.HTMLCanvasElement
import org.w3c.dom.HTMLElement
import org.w3c.dom.get
import kotlin.browser.document
import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 */

external fun generateExerciseForKotlin() : GeneratedExercise
external fun generateExerciseEasyScoreCode() : EasyScoreCode
external var listenerApp : ListenerApp
external var audioAnalyzer : AudioAnalyzer

external fun loadXml(url : String, callback: (String) -> Unit)

public class ListenerApp {
    var globalTempo = 120.0 //should be accessed by everyone
      private set

    fun setTempoForTests(t : Double) {
      globalTempo = t
    }

    lateinit var scoreUtil : EasyScoreUtil
    lateinit var generatedExercise : GeneratedExercise

    lateinit var parameters : AppSetupParameters

    lateinit var audioManager : AudioManager

    lateinit var exerciseManager : ExerciseManager

    lateinit var tuner : PMTuner

    @JsName("runTuner")
    fun runTuner(parameters: dynamic) {
      console.log("Running with parameters:")
      console.log(parameters)

      Note.createAllNotes()

      audioAnalyzer.setupMedia()

      val container = this.makeTunerDomElements()

      tuner = PMTuner()
      tuner.textElement = container
      tuner.audioAnalyzer = audioAnalyzer

      tuner.run()
    }

    @JsName("runApp")
    fun runApp(parameters: AppSetupParameters) {

        loadXml(parameters.xmlUrl,{ callbackData ->

          console.log("Callback:")
          //console.log(callbackData)

          val converter = jsMusicXMLConverter()
          val json = converter.convertXMLToJSON(callbackData)

          console.log("JSON:")
          //console.log(json)

          val jsCode = converter.convertJSON(json,ConverterInputAttributes("4/4",4))

          converter.loadCode(jsCode)

          this.finishRunApp(parameters)
        })


    }

    fun finishRunApp(parameters: AppSetupParameters) {
      this.parameters = parameters

        this.audioManager = AudioManager()

        this.exerciseManager = ExerciseManager(audioManager)

        this.scoreUtil = EasyScoreUtil()


        Note.createAllNotes()

        audioAnalyzer.setupMedia()

        //check the ones from alterPreferences first
        val prefs = AppPreferences(parameters.metronomeSound,parameters.bpm,parameters.transposition,parameters.pitch)
        this.alterPreferences(prefs)

        this.generatedExercise = generateExerciseForKotlin()

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)

        //set the global tempo
        this.globalTempo = this.generatedExercise.tempo

        this.exerciseManager.loadExercise()

        this.makeDomElements()
    }

    @JsName("alterPreferences")
    fun alterPreferences(preferences : AppPreferences) {
      exerciseManager.stop()
      preferences.metronomeSound?.let {
        UserSettings.metronomeAudioOn = it
      }
      preferences.bpm?.let {
        console.log("Setting bpm to $it")
        //set the tempo
        globalTempo = it.toDouble()
        //reset the tempo in the UI
        this.scoreUtil.setupMetronome(this.parameters.metronomeContainerName)
      }
      preferences.pitch?.let {
        UserSettings.pitch = it
      }
      preferences.transposition?.let {
        UserSettings.transposition = it

        this.generatedExercise = UserSettings.applyToExercise(this.generatedExercise)
      }
    }

    fun makeTunerDomElements() : HTMLElement {
      val container = document.getElementById("tunerWindow") as HTMLElement
      return container
    }

    fun makeDomElements() {

        pm_log("Making window w/ container: " + this.parameters.notationContainerName,10)

        //alter the style of the container element
        val container = document.getElementById(this.parameters.notationContainerName) as HTMLElement
        container.className += "notationBodyContainer"

        //make the canvases
        val indicatorCanvasName = "indicatorCanvas"
        val indicatorCanvasObj = document.createElement("canvas") as HTMLElement
        indicatorCanvasObj.style.position = "absolute"
        indicatorCanvasObj.id = indicatorCanvasName
        document.getElementById(this.parameters.notationContainerName)?.appendChild(indicatorCanvasObj)

        pm_log("Made indicator canvas on notation body: ",10)
        pm_log(document.getElementById(this.parameters.notationContainerName) as HTMLElement)

        val feedbackCanvasName = "feedbackCanvas"
        val feedbackCanvasObj = document.createElement("canvas") as HTMLElement
        feedbackCanvasObj.style.position = "absolute"
        feedbackCanvasObj.id = feedbackCanvasName
        document.getElementById(this.parameters.notationContainerName)?.appendChild(feedbackCanvasObj)

        this.makeScore(this.parameters.notationContainerName)

//        //for testing
//            val feedbackItems = listOf(
//                    FeedbackItem(FeedbackType.Missed,1.0, listOf(FeedbackMetric("test","val"))),
//                    FeedbackItem(FeedbackType.Incorrect,2.0, listOf(FeedbackMetric("test","val"))),
//                    FeedbackItem(FeedbackType.Missed,3.0, listOf(FeedbackMetric("test","val")))
//            )
//
//            feedbackItems.forEach {
//                    listenerApp.addFeedbackItem(it)
//            }
    }

    fun makeScore(containerElementName : String) {
        this.scoreUtil = EasyScoreUtil()
        this.scoreUtil.containerElementName = this.parameters.notationContainerName

        val exercise = generateExerciseEasyScoreCode(); //pulls from the loaded js file

        //make sure it has a reference to the loaded exercise
        this.scoreUtil.exercise = exercise
        this.scoreUtil.generatedExercise = this.generatedExercise

        pm_log("Setting up score on " + containerElementName)
        //setup the score
        this.scoreUtil.setupOnElement(containerElementName)

        this.scoreUtil.setupMetronome(this.parameters.metronomeContainerName)

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

                //check to make sure the audio analyzer is functional
                if (!audioAnalyzer.isFunctional || !audioAnalyzer.hasMicrophoneAccess) {
                  displayFlashMessages(
                    arrayOf(FlashMessage(type="danger",message="Audio not working.  Please make sure you are using either Chrome or Firefox and have enabled microphone access."))
                  )
                  return
                }

                exerciseManager.createSteppables()
                exerciseManager.setup()
                exerciseManager.loadExercise()

                exerciseManager.run()
            }
            TimeKeeper.TimeKeeperState.Running -> {
                exerciseManager.stop()
            }
            TimeKeeper.TimeKeeperState.Completed -> {
                //should hit this
                //TODO: new case
            }
        }
    }

    @JsName("doResizeActions")
    fun doResizeActions() {
        pm_log("Resized window w/ container: " + this.parameters.notationContainerName,10)

        val oldSVG = document.getElementsByTagName("svg").get(0) as Element
        oldSVG.parentNode?.removeChild(oldSVG)

        listenerApp.makeScore(this.parameters.notationContainerName)
        val copyOfFeedbackItems = listenerApp.currentFeedbackItems.toList()
        listenerApp.clearFeedbackItems()
        copyOfFeedbackItems.forEach { listenerApp.addFeedbackItem(it) }
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

    val currentFeedbackItems = mutableListOf<FeedbackItem>()

    //clear existing feedback items from the screen
    fun clearFeedbackItems() {
        currentFeedbackItems.removeAll { true }
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
    fun addFeedbackItem(feedbackItem : FeedbackItem) {
        if (currentFeedbackItems.indexOf(feedbackItem) == -1) currentFeedbackItems += feedbackItem
        val positionForBeat = this.scoreUtil.getPositionForBeat(feedbackItem.beat)
        //pm_log("Position for beat: ",10)
        //pm_log(positionForBeat,10)
        val positionY = this.scoreUtil.getFeedbackYPosition(positionForBeat.y)
        //EasyScoreUtil.drawFeedbackAtPosition(feedbackCanvas,items,positionForBeat.x,positionY)
        this.scoreUtil.createFeedbackHTMLElement(feedbackItem.type,feedbackItem.feedbackItemType.toTypedArray(),positionForBeat.x,positionY)
    }
}
