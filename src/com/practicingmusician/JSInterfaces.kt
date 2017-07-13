package com.practicingmusician

import com.practicingmusician.finals.FeedbackMetric


/**
 * Created by jn on 6/27/17.
 *
 * These are interfaces so that Kotlin can talk to the JavaScript objects easily
 *
 */

external fun pm_log(msg : Any, level : Int = definedExternally)

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
    val allowableLengthMargin : Double
}

interface AudioAnalyzer {
    fun setupMedia()
    @JsName("updatePitch")
    fun updatePitch(timestamp : Double) : Double
}

interface GeneratedExercise {
    var tempo : Double
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

    fun createFeedbackHTMLElement(items : Array<FeedbackMetric>, x : Double, y : Double)
}

data class BeatPosition(val x : Double, val y : Double)
