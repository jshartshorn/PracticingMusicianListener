package com.practicingmusician.tests

import com.practicingmusician.finals.BufferManager
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.SampleCollection
import kotlin.js.Math

/**
 * Created by jn on 6/7/17.
 */
object TestBufferGenerator {

    fun generateExactBufferFromNotes(notes : List<Note>, tempo : Double) : List<Double> {
        return BufferManager.convertNotesToSamples(notes, tempo)
    }

    fun generateExactBufferCollectionFromNotes(notes : List<Note>, tempo: Double) : List<SampleCollection> {
        val secondsPerBeat = 60.0 / tempo


        return notes.map {

            val collection = SampleCollection(it.getFrequency(),(it.duration * secondsPerBeat * BufferManager.sampleRate).toInt())

            collection
        }
//
//        val samples = mutableListOf<Double>()
//        val noteChangeIndexes = mutableListOf<Int>()
//        notes.forEach {
//            noteChangeIndexes.add(samples.count())
//            val numSamplesToCreate = it.duration * secondsPerBeat * BufferManager.sampleRate
//            val freq = it.getFrequency()
//            for (i in 0 until numSamplesToCreate.toInt()) {
//                samples.add(freq)
//            }
//        }
//        console.log("Note change indexes: " + noteChangeIndexes)
//
//        val collections = samples.map {
//            val collection = SampleCollection(freq = it, lengthInSamples = 1)
//            collection
//        }
//
//        return collections
    }

    fun addAvgPitchToSamples(notes : List<Note>) : List<Note> {
        return notes.map {
            it.avgFreq = it.getFrequency()
            it
        }
    }

    fun addPitchVariationToSamples(buffer : List<Double>) : List<Double>  {
        val pitchVariation = 15.0

        return buffer.map {
            //it - 6

            val randomAddition = Math.random() * pitchVariation * 2
            //it - pitchVariation + randomAddition
            it + randomAddition / 2.0
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

    fun addShortItemsThatShouldBeRemoved(buffer : List<Double>) : List<Double> {
        var newBuffer = buffer.toMutableList()

        for (i in 0..5) {
            newBuffer.add(0, 2.0)
        }


        for (i in 0..15) {
            newBuffer.add(100, 2.0)
        }
//
        for (i in 0..3) {
            newBuffer.add(10000, 2.0)
        }


        return newBuffer
    }


}