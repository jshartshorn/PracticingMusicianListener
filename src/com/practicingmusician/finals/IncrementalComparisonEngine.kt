package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import kotlin.browser.window
import kotlin.js.Math

/**
 * Created by jn on 6/23/17.
 *
 * This should take a given set of notes generated from the samples and compare it to the ideal
 * (generated from the exercise)
 *
 */
class IncrementalComparisonEngine {

    //the margins in which a note can vary from the ideal and still be considered acceptable
    val allowableFreqencyMargin = 20.0 //TODO: this should be cents, not hz
    val allowableRhythmMargin = 0.25
    val allowableLengthMargin = 0.25 //TODO: use this

    /* State information about what has been compared */

//    var results = CompareResults() //the results of the comparison
//    var curBeatPosition : Double = 0.0 //current beat position that is being compared
//
//    var idealIndexPosition = 0 //the ideal index to test against, so we don't start at the beginning each time
//    var testPositionIndex = 0 //don't search before here in the test positions


    /* End state */

    //Comapares the ideal (which should be generated from the exercise) to the toTest
    //which should be generated from the microphone samples
    fun compareNoteArrays(ideal : List<Note>, toTest : List<NotePlacement>) : CompareResults {

        val results = CompareResults()
        var curBeatPosition : Double = 0.0
        var lastTestedIndexInTest = -1


        var doNotTestBeyond = 0.0
        if (toTest.count() > 0) {
            doNotTestBeyond = toTest.last().positionInBeats + toTest.last().note.duration
        }

        val functionStartTimestamp = window.performance.now()

        //loop throug the ideal items to test against
        //don't start before the stuff that we've already analyzed (based on idealIndexPosition)
        for (index in 0 until ideal.count()) {
            var value = ideal[index]

            //TODO: make sure we have enough data to test against the item


            //TODO: okay, we have enough to test, so set the new idealIndexPosition
            //idealIndexPosition = index

            //find the corresponding item in toTest based on our beat position
            var indexOnToTest = -1 //this will store the index on toTest that we will compare
            var toTestBeatPositionAtIndexToTest = 0.0 //the beat position at that index
            var toTestBeatPosition = 0.0 //the current beat position on toTest
            var diffFromIdealBeatPosition = Double.MAX_VALUE //the difference in position from the ideal to the test subject

            //loop through the test items
            //don't start before the ones we've already tested (based on testPositionIndex)
            for (i in 0 until toTest.count()) {
                val item = toTest[i]

                toTestBeatPosition = item.positionInBeats

                //find the difference between the current beat position (where we are in the ideal)
                //and the test beat position
                val diff = Math.abs(curBeatPosition - toTestBeatPosition)

                //if the difference is less than the smallest difference we've found so far (it starts at Double.MAX_VALUE)
                //than this is the best candidate for now
                if (diff < diffFromIdealBeatPosition) {
                    indexOnToTest = i
                    toTestBeatPositionAtIndexToTest = toTestBeatPosition
                    diffFromIdealBeatPosition = diff
                }

                //increment the current position of toTest
            }

            if (curBeatPosition >= doNotTestBeyond) {
                println("Too far")
                break
            }

            if (indexOnToTest <= lastTestedIndexInTest) {
                println("Already tested here...... $indexOnToTest <= $lastTestedIndexInTest")
                //TODO: Fix this? -- need new method for seeing how far to test
                //break
            }

            lastTestedIndexInTest = indexOnToTest

            println("Going to compare ideal index $index to test index $indexOnToTest")

            //This is the feedback item that will store the information (flat, sharp, etc)
            //generated by this comparison
            var feedbackItem = FeedbackItem(curBeatPosition,"")

            //add it to the results -- we still have a reference, so the version in the list
            //will get altered
            results.feedbackItems.add(feedbackItem)

            //TODO: not sure if we should do this, or just stop
            if (indexOnToTest == -1) {
                continue
            }

            //TODO: For speed reasons, do I need to implement this again?
            //don't test before this index later on
            //testPositionIndex = indexOnToTest

            //no matter what happens, we know it's an attempt
            results.attempted += 1

            //start by assuming it is correct
            var isCorrect = true

            val idealItem = value

            val testItem = toTest[indexOnToTest]

            println("Durations : " + idealItem.duration + " | " + testItem.note.duration)

            //test the durations of the notes
            if (idealItem.duration - testItem.note.duration > allowableRhythmMargin) {
                println("Test subject too short")
                isCorrect = false
            } else if (idealItem.duration - testItem.note.duration < -allowableRhythmMargin) {
                println("Test subject too long")
                isCorrect = false
            } else {
                println("PERFECT")
            }


            println("Starting points : " + curBeatPosition + " | " + toTestBeatPositionAtIndexToTest)

            //test the start time of the notes (rushing vs. dragging)
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

            println("Pitch : " + idealItem.getFrequency() + " | " + testItem.note.getFrequency())

            println("Avg freq of test item: " + testItem.note.avgFreq)


            //test the intonation of the notes
            val avgFreq = testItem.note.avgFreq

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

            feedbackItem.feedbackItemType = "" + testItem.note.noteNumber

            //increment the current position based on the duration of the ideal
            curBeatPosition += value.duration

            //if it's correct, increment that counter -- if not, do nothing
            if (isCorrect)
                results.correct += 1
        }


        println("---- Results : " + results.correct + "/" + results.attempted)

        val functionEndTimestamp = window.performance.now()

        println("Function total time: " + (functionEndTimestamp - functionStartTimestamp))

        return results

    }

}