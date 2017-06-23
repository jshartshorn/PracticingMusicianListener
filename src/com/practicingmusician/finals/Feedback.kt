package com.practicingmusician.finals

/**
 * Created by jn on 6/23/17.
 */


data class FeedbackItem(var beat : Double, var feedbackItemType : String)

class CompareResults {
    var correct : Int = 0
    var attempted : Int = 0
    var feedbackItems = mutableListOf<FeedbackItem>()
}