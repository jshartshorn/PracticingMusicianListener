package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */
object CompareEngine {

    val allowableFreqencyMargin = 4.0
    val allowableRhythmMargin = 0.25

    fun compareNoteArrays(ideal : List<Note>, toTest : List<Note>) {
        console.log("Comparing...")

        var idealBeatIndex = 0.0
        var testBeatIndex = 0.0

        for ((index, value) in ideal.withIndex()) {
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
            } else if (idealBeatIndex - testBeatIndex < -allowableRhythmMargin) {
                println("Test subject dragging")
            } else {
                println("PERFECT")
            }


            idealBeatIndex += idealItem.duration
            testBeatIndex += testItem.duration
            println("Pitch : " + idealItem.getFrequency() + " | " + testItem.getFrequency())

            if (testItem.getFrequency() - idealItem.getFrequency() > allowableFreqencyMargin) {
                println("Test subject sharp")
            } else if (testItem.getFrequency() - idealItem.getFrequency() < -allowableFreqencyMargin) {
                println("Test subject flat")
            } else {
                println("PERFECT")
            }
        }

    }

}
