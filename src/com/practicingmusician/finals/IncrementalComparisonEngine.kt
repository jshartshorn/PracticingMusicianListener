package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import kotlin.js.Math

/**
 * Created by jn on 6/23/17.
 */
class IncrementalComparisonEngine {

    //the margins in which a note can vary from the ideal and still be considered acceptable
    val allowableFreqencyMargin = 10.0 //TODO: this should be cents, not hz
    val allowableRhythmMargin = 0.25

    /* State information about what has been compared */

    var results = CompareResults() //the results of the comparison
    var curBeatPosition : Double = 0.0 //current beat position that is being compared

    var idealIndexPosition = 0 //the ideal index to test against, so we don't start at the beginning each time
    var testPositionIndex = 0 //don't search before here in the test positions

    /* End state */

    //Comapares the ideal (which should be generated from the exercise) to the toTest
    //which should be generated from the microphone samples
    fun compareNoteArrays(ideal : List<Note>, toTest : List<Note>) : CompareResults {

        for (index in idealIndexPosition until ideal.count()) {
            var value = ideal[index]

            //TODO: make sure we have enough data to test against the item


            //TODO: okay, we have enough to test, so set the new idealIndexPosition
            idealIndexPosition = index

            //find the corresponding item in toTest based on our beat position
            var indexOnToTest = -1
            var toTestBeatPositionAtIndexToTest = 0.0
            var toTestBeatPosition = 0.0
            var diffFromIdealBeatPosition = Double.MAX_VALUE

            for (i in testPositionIndex until toTest.count()) {
                val item = toTest[i]

                val diff = Math.abs(curBeatPosition - toTestBeatPosition)

                if (diff < diffFromIdealBeatPosition) {
                    indexOnToTest = i
                    toTestBeatPositionAtIndexToTest = toTestBeatPosition
                    diffFromIdealBeatPosition = diff
                }

                toTestBeatPosition += item.duration
            }

            println("Going to compare ideal index $index to test index $indexOnToTest")

            var feedbackItem = FeedbackItem(curBeatPosition,"")

            results.feedbackItems.add(feedbackItem)

            //TODO: not sure if we should do this, or just stop
            if (indexOnToTest == -1) {
                continue
            }

            //don't test before this index later on
            testPositionIndex = indexOnToTest


            results.attempted += 1

            var isCorrect = true

            val idealItem = value

            val testItem = toTest[indexOnToTest]

            println("Durations : " + idealItem.duration + " | " + testItem.duration)

            if (idealItem.duration - testItem.duration > allowableRhythmMargin) {
                println("Test subject too short")
                isCorrect = false
            } else if (idealItem.duration - testItem.duration < -allowableRhythmMargin) {
                println("Test subject too long")
                isCorrect = false
            } else {
                println("PERFECT")
            }


            println("Starting points : " + curBeatPosition + " | " + toTestBeatPositionAtIndexToTest)


            if (curBeatPosition - toTestBeatPositionAtIndexToTest > allowableRhythmMargin) {
                println("Test subject rushing")

                feedbackItem.feedbackItemType += ">"

                isCorrect = false
            } else if (curBeatPosition - toTestBeatPositionAtIndexToTest < -allowableRhythmMargin) {
                println("Test subject dragging")

                feedbackItem.feedbackItemType += "<"

                isCorrect = false
            } else {
                println("PERFECT")
            }

            println("Pitch : " + idealItem.getFrequency() + " | " + testItem.getFrequency())

            println("Avg freq of test item: " + testItem.avgFreq)

            var avgFreq = testItem.avgFreq

            if (avgFreq != null) {
                if (avgFreq - idealItem.getFrequency() > allowableFreqencyMargin) {
                    println("Test subject sharp")

                    feedbackItem.feedbackItemType += "^"

                    isCorrect = false
                } else if (avgFreq - idealItem.getFrequency() < -allowableFreqencyMargin) {
                    println("Test subject flat")

                    feedbackItem.feedbackItemType += "_"

                    isCorrect = false
                } else {
                    println("PERFECT")
                }
            }


            curBeatPosition += value.duration


            if (isCorrect)
                results.correct += 1
        }

        println("---- Results : " + results.correct + "/" + results.attempted)

        return results

    }

}