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
external fun displaySiteDialog(params : DialogParams)

data class DialogParams(val imageType : String, val title : String, val message : String)

data class FlashMessage(val type : String, val message : String)

data class ComparisonFlags(
  val testPitch : Boolean,
  val testRhythm : Boolean,
  val testDuration : Boolean
)

interface AppPreferences {
  val metronomeSound : Boolean?
  val bpm : Int?
}

interface AppSetupParameters {
    //DOM element IDs
    val notationContainerName : String
    val metronomeContainerName : String

    val userID : Int
    val exerciseID: Int

    //database endpoint for storing performance data
    val databaseEndpoint : String

    //base URL of the app
    val url : String

    //directory in which audio assets are stored
    val audioAssetPath : String

    //the margins in which a note can vary from the ideal and still be considered acceptable
    val allowableCentsMargin : Int
    val allowableRhythmMargin : Double
    val allowableDurationRatio : Double

    val largestDurationRatioDifference : Double
    val minDurationInBeats : Double

    //which metrics to compare
    val comparisonFlags : ComparisonFlags
}

interface AudioAnalyzer {
    var isFunctional : Boolean
    var hasMicrophoneAccess : Boolean
    fun setupMedia()
    @JsName("updatePitch")
    fun updatePitch(timestamp : Double) : Double
}

interface GeneratedExercise {
    var tempo : Double
    val time_signature : Int
    val count_off : Double
    var notes : Array<SimpleJSNoteObject>
}

external class Audio(filename : String) {
    var currentTime : Int
    fun play()
}


interface EasyScoreCode {
    val bars : Array<dynamic>
}

data class SimpleJSNoteObject(val noteNumber : Int, val duration : Double)

external class EasyScoreUtil  {
    var exercise : EasyScoreCode
    lateinit var generatedExercise : GeneratedExercise
    lateinit var containerElementName : String

    fun setupOnElement(elementID : String)

    fun setupMetronome(elementID : String)

    fun buildTitleElements(elementID : String)

    fun notateExercise()
    fun drawIndicatorLine(canvas : dynamic, beat : Double)

    fun getPositionForBeat(beat: Double) : BeatPosition
    fun getFeedbackYPosition(staveTopY : Double) : Double

    fun createFeedbackHTMLElement(type: FeedbackType, items : Array<FeedbackMetric>, x : Double, y : Double)
}

data class BeatPosition(val x : Double, val y : Double)
