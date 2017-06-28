package com.practicingmusician

/**
 * Created by jn on 6/27/17.
 *
 * These are interfaces so that Kotlin can talk to the JavaScript objects easily
 *
 */


interface AudioAnalyzer {
    fun setupMedia()
    @JsName("updatePitch")
    fun updatePitch(timestamp : Double) : Double
}

interface GeneratedExercise {
    val tempo : Double
    val notes : Array<SimpleJSNoteObject>
}

interface AudioObjectInterface {

}

interface SimpleJSNoteObject {
    val noteNumber : Int
    val duration : Double
}

interface ListenerApp {
    var generatedExercise : GeneratedExercise

    @JsName("runApp")
    fun runApp()

    @JsName("clearFeedbackItems")
    fun clearFeedbackItems()

    @JsName("moveToPosition")
    fun moveToPosition(beat:Double)

    @JsName("highlightMetronomeItem")
    fun highlightMetronomeItem(itemNumber : Int)

    @JsName("addFeedbackItem")
    fun addFeedbackItem(beat : Double, items : List<String>)
}