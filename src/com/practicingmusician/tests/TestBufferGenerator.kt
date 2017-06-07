package com.practicingmusician.tests

import com.practicingmusician.finals.BufferManager
import com.practicingmusician.notes.Note
import kotlin.js.Math

/**
 * Created by jn on 6/7/17.
 */
object TestBufferGenerator {

    fun generateExactBufferFromNotes(notes : List<Note>) : List<Double> {
        return BufferManager.convertNotesToSamples(notes)
    }

    fun addAvgPitchToSamples(notes : List<Note>) : List<Note> {
        return notes.map {
            it.avgFreq = it.getFrequency()
            it
        }
    }

    fun addPitchVariationToSamples(buffer : List<Double>) : List<Double>  {
        //var pitchVariation = 3.0

        return buffer.map {
            it - 2

            //this won't work until we have some leniency in grouping the values
            //var randomAddition = Math.random() * pitchVariation * 2
            //it - pitchVariation + randomAddition
        }

    }


    fun addRhythmVariationToSamples(buffer : List<Double>) : List<Double> {
        var newBuffer = buffer.toMutableList()

        for (i in 0..3600) {
            newBuffer.removeAt(0)
        }


        for (i in 14000..18000) {
            newBuffer.add(newBuffer[400])
        }

        for (i in 13000..15500) {
            newBuffer.removeAt(0)
        }

        return newBuffer
    }

}