package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */

data class CompareResults(var correct : Int, var attempted : Int)

object CompareEngine {

    val allowableFreqencyMargin = 4.0
    val allowableRhythmMargin = 0.25

    fun compareNoteArrays(ideal : List<Note>, toTest : List<Note>) {
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
            
            if (testItem.getFrequency() - idealItem.getFrequency() > allowableFreqencyMargin) {
                println("Test subject sharp")
                isCorrect = false
            } else if (testItem.getFrequency() - idealItem.getFrequency() < -allowableFreqencyMargin) {
                println("Test subject flat")
                isCorrect = false
            } else {
                println("PERFECT")
            }

            if (isCorrect)
                results.correct += 1
        }

        println("Results : " + results.correct + "/" + results.attempted)
    }

}
