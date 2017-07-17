package com.practicingmusician.finals

/**
 * Created by jn on 6/23/17.
 */

data class FeedbackMetric(var name : String, var value : String)

enum class FeedbackType {
  Correct, Incorrect, Missed
}

data class FeedbackItem(var type : FeedbackType, var beat : Double, var feedbackItemType : List<FeedbackMetric>)

fun FeedbackItem.throwSafeIncorrectSwitch() {
  if (this.type != FeedbackType.Missed) {
    this.type = FeedbackType.Incorrect
  }
}

class CompareResults(val c : Int = 0, val a : Int = 0) {
    var correct : Int = c
    var attempted : Int = a
    var feedbackItems = mutableListOf<FeedbackItem>()

    var finalResults = mutableListOf<IndividualNotePerformanceInfo>()

    fun generateResultForDatabase() : ResultsForDatabase {
        //TODO: generate exercise averages

        val pitch = finalResults.map { it.idealPitch - it.actualPitch }.average()
        val rhythm = finalResults.map { it.idealBeat - it.actualBeat }.average()
        val duration = finalResults.map { it.idealDuration - it.actualDuration }.average()

        return ResultsForDatabase(
                correct = this.correct,
                attempted =  this.attempted,
                exerciseAveragePitch = pitch,
                exerciseAverageRhythm = rhythm,
                exerciseAverageDuration = duration,
                notePerformances = finalResults
        )
    }
}

data class ResultsForDatabase(var userID : Int = -1, var exerciseID : Int = -1, val correct : Int, val attempted: Int, val exerciseAveragePitch : Double, val exerciseAverageRhythm: Double, val exerciseAverageDuration : Double, val notePerformances: List<IndividualNotePerformanceInfo>)

data class IndividualNotePerformanceInfo(val idealBeat: Double, val actualBeat: Double, val idealPitch : Double, val actualPitch: Double, val idealDuration: Double, val actualDuration : Double)
