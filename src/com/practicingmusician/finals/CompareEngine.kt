package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import kotlin.js.Math.abs

/**
 * Created by jn on 6/7/17.
 */

data class CompareResults(var correct : Int, var attempted : Int)

object CompareEngine {

    val allowableFreqencyMargin = 4.0
    val allowableRhythmMargin = 0.25

    fun compareNoteArrays(ideal : List<Note>, toTest : List<Note>) : CompareResults {

        var results = CompareResults(correct = 0, attempted =  0)

        var curBeatPosition : Double = 0.0

        for ((index, value) in ideal.withIndex()) {

            //find the corresponding item in toTest based on our beat position
            var indexOnToTest = -1
            var toTestBeatPositionAtIndexToTest = 0.0
            var toTestBeatPosition = 0.0
            var diffFromIdealBeatPosition = Double.MAX_VALUE
            for (i in toTest.indices) {
                val item = toTest[i]

                val diff = abs(curBeatPosition - toTestBeatPosition)

                if (diff < diffFromIdealBeatPosition) {
                    indexOnToTest = i
                    toTestBeatPositionAtIndexToTest = toTestBeatPosition
                    diffFromIdealBeatPosition = diff
                }

                toTestBeatPosition += item.duration
            }

            println("Going to compare ideal index $index to test index $indexOnToTest")

            if (indexOnToTest == -1) {
                continue
            }


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
                isCorrect = false
            } else if (curBeatPosition - toTestBeatPositionAtIndexToTest < -allowableRhythmMargin) {
                println("Test subject dragging")
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
                    isCorrect = false
                } else if (avgFreq - idealItem.getFrequency() < -allowableFreqencyMargin) {
                    println("Test subject flat")
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

    fun OLD_compareNoteArrays(ideal : List<Note>, toTest : List<Note>) : CompareResults {
        console.log("Comparing...")

        var idealBeatIndex = 0.0
        var testBeatIndex = 0.0


        var results = CompareResults(correct = 0, attempted =  0)


        //TODO: probably need to rewind/fast-forward on toTest instead of just using the same index
        for ((index, value) in ideal.withIndex()) {

            results.attempted += 1

            var isCorrect = true

            val idealItem = value

            //test to see if the index is out of bounds
            if (index >= toTest.count()) {
                println("Out of items!")
                break
            }

            val testItem = toTest[index]
            println("Comparing at index $index")
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


            println("Starting points : " + idealBeatIndex + " | " + testBeatIndex)


            if (idealBeatIndex - testBeatIndex > allowableRhythmMargin) {
                println("Test subject rushing")
                isCorrect = false
            } else if (idealBeatIndex - testBeatIndex < -allowableRhythmMargin) {
                println("Test subject dragging")
                isCorrect = false
            } else {
                println("PERFECT")
            }


            idealBeatIndex += idealItem.duration
            testBeatIndex += testItem.duration
            println("Pitch : " + idealItem.getFrequency() + " | " + testItem.getFrequency())

            println("Avg freq of test item: " + testItem.avgFreq)

            var avgFreq = testItem.avgFreq

            if (avgFreq != null) {
                if (avgFreq - idealItem.getFrequency() > allowableFreqencyMargin) {
                    println("Test subject sharp")
                    isCorrect = false
                } else if (avgFreq - idealItem.getFrequency() < -allowableFreqencyMargin) {
                    println("Test subject flat")
                    isCorrect = false
                } else {
                    println("PERFECT")
                }
            }



            if (isCorrect)
                results.correct += 1
        }

        println("---- Results : " + results.correct + "/" + results.attempted)

        return results
    }

}
