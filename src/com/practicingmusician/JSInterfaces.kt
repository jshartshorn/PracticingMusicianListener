package com.practicingmusician

/**
 * Created by jn on 6/27/17.
 */


interface AudioAnalyzer {
    fun setupMedia()
    @JsName("updatePitch")
    fun updatePitch(timestamp : Double) : Double
}

interface ListenerApp {
    var generatedExercise : dynamic

    @JsName("clearFeedbackItems")
    fun clearFeedbackItems()

    @JsName("moveToPosition")
    fun moveToPosition(beat:Double)

    @JsName("highlightMetronomeItem")
    fun highlightMetronomeItem(itemNumber : Int)

    @JsName("addFeedbackItem")
    fun addFeedbackItem(beat : Double, items : List<String>)
}