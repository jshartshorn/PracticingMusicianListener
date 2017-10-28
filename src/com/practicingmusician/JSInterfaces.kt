package com.practicingmusician

import com.practicingmusician.finals.FeedbackMetric
import com.practicingmusician.finals.FeedbackType


/**
 * Created by jn on 6/27/17.
 *
 * These are interfaces so that Kotlin can talk to the JavaScript objects easily
 *
 */

external fun pm_log(msg : Any, level : Int = definedExternally)
external fun displayFlashMessages(messages : Array<FlashMessage>)

data class DialogParams(val imageType : String, val title : String, val message : String)

data class FlashMessage(val type : String, val message : String)

data class ConverterOutput(val easyScoreInfo: EasyScoreCode)

external class jsMusicXMLConverter {
  fun convertXMLToJSON(xmlString : String) : dynamic
  fun convertJSON(input: dynamic) : ConverterOutput
}

data class ComparisonFlags(
  val testPitch : Boolean,
  val testRhythm : Boolean,
  val testDuration : Boolean
)

data class AppPreferences (
    val metronomeSound : Boolean?,
    val bpm : Int?,
    val transposition : Int?,
    val pitch : Double?
)

interface AppSetupParameters {
    //DOM element IDs
    val notationContainerName : String
    val metronomeContainerName : String
    val controlsContainerName : String

    val userID : Int
    val exerciseID: Int

    //database endpoint for storing performance data
    val databaseEndpoint : String

    //base URL of the app
    val url : String

    //directory in which audio assets are stored
    val audioAssetPath : String

    //path to the XML file to load
    val xmlUrl : String

    //the margins in which a note can vary from the ideal and still be considered acceptable
    val allowableCentsMargin : Int
    val allowableRhythmMargin : Double
    val allowableDurationRatio : Double

    val largestDurationRatioDifference : Double
    val largestBeatDifference : Double
    val minDurationInBeats : Double

    val displaySiteDialog : (params : DialogParams) -> Unit

    //normally would get set in alterPreferences, but can get set here too
    val metronomeSound : Boolean?
    val bpm : Int?
    val transposition : Int?
    val pitch : Double?
}

interface AudioAnalyzer {
    var isFunctional : Boolean
    var hasMicrophoneAccess : Boolean
    fun setupMedia()
    @JsName("updatePitch")
    fun updatePitch(timestamp : Double) : Double
}

external class Audio(filename : String) {
    var currentTime : Int
    fun play()
}


interface EasyScoreCode {
    val title: String
    val author: String
    val time_signature: String
    val count_off: Double
    var tempo: Double
    val comparisonFlags : ComparisonFlags
    val copyrightInfo: String
    val systems: Array<dynamic>
    var notes: Array<SimpleJSNoteObject>
}

data class SimpleJSNoteObject(val noteNumber : Int, val duration : Double, val id : String = "")

external class EasyScoreUtil  {
    var exercise : EasyScoreCode?
    lateinit var containerElementName : String

    fun changePlayButton(buttonClass : String)

    fun displayMedal(medalClass : String)

    fun setupOnElement(elementID : String)

    fun setupMetronome(elementID : String)

    fun setupControls(elementID: String)

    fun buildTitleElements(elementID : String)

    fun notateExercise()
    fun drawIndicatorLine(canvas : dynamic, beat : Double)

    fun getPageForBeat(beat : Double) : Int
    fun showPageNumber(pageNumber : Int)

    fun getPositionForBeat(beat: Double) : BeatPosition
    fun getFeedbackYPosition(staveTopY : Double) : Double

    fun createFeedbackHTMLElement(type: FeedbackType, items : Array<FeedbackMetric>, x : Double, y : Double, page : Int)
}

data class BeatPosition(val x : Double, val y : Double, val page : Int)
