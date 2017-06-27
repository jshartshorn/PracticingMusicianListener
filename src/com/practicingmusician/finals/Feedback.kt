package com.practicingmusician.finals

/**
 * Created by jn on 6/23/17.
 */


data class FeedbackItem(var beat : Double, var feedbackItemType : List<String>)

class CompareResults(val c : Int = 0, val a : Int = 0) {
    var correct : Int = c
    var attempted : Int = a
    var feedbackItems = mutableListOf<FeedbackItem>()
}