package com.practicingmusician.finals

/**
 * Created by jn on 6/23/17.
 */

//This is an individual metric (like Pitch or Duration) that gets sent to EasyScore
data class FeedbackMetric(var name : String, var value : String)

enum class FeedbackType {
  Correct, Incorrect, Missed
}

data class FeedbackItem(var type : FeedbackType, var beat : Double, var feedbackItemType : List<FeedbackMetric>)

//this will only change it to incorrect if it hasn't been marked as worse (missed)
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

        val pitch = finalResults.map { it.idealPitch - it.actualPitch }.average()
        val rhythm = finalResults.map { it.idealBeat - it.actualBeat }.average()
        val duration = finalResults.map { it.idealDuration - it.actualDuration }.average()

        return ResultsForDatabase(
                correct = this.correct,
                attempted =  this.attempted,
                exerciseAveragePitch = pitch,
                exerciseAverageRhythm = rhythm,
                exerciseAverageDuration = duration,
                notePerformances = finalResults.toTypedArray()
        )
    }
}

data class ToleranceLevels(val allowableCentsMargin : Int, val allowableRhythmMargin: Double, val allowableDurationRatio : Double, val largestBeatDifference : Double, val largestDurationRatioDifference : Double, val minDurationInBeats : Double )

data class ResultsForDatabase(var userID : Int = -1, var exerciseID : Int = -1, var toleranceLevels : ToleranceLevels = ToleranceLevels(0,0.0,0.0,0.0,0.0,0.0),val correct : Int, val attempted: Int, val exerciseAveragePitch : Double, val exerciseAverageRhythm: Double, val exerciseAverageDuration : Double, val notePerformances: Array<IndividualNotePerformanceInfo>)

data class IndividualNotePerformanceInfo(val idealBeat: Double, val actualBeat: Double, val idealPitch : Double, val actualPitch: Double, val idealDuration: Double, val actualDuration : Double)
