package com.practicingmusician.tests

import com.practicingmusician.models.Slice
import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */
object SliceTest {

    val notes = listOf(Note(69,1.0),Note(69,1.0),Note(69,1.0),Note(69,1.0))
    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val slicesPerBeat = 32
    val sampleRate = 44100.0
    val bufferLengthInSamples = 1024

    fun getPremadeSlices() : List<Slice> {
        val slices = mutableListOf<Slice>()

        notes.forEach {
            val numberSlices = it.duration * slicesPerBeat
            for (i in 0 until numberSlices.toInt()) {
                slices.add(Slice(it.getFrequency()))
            }
        }

        return slices
    }

    @JsName("runTest")
    fun runTest() : String {

        val slices = getPremadeSlices()

        convertTimestampsToSlices()

        return "Done"
    }

    fun convertTimestampsToSlices() {
        val lengthOfNotesInSeconds = notes.map { it.duration }.reduce { acc, d -> acc + d } * secondsPerBeat
        val numberTotalSamples = sampleRate * lengthOfNotesInSeconds

        val sliceLengthInSamples = sampleRate * secondsPerBeat / slicesPerBeat

        console.log("Slice length in samples: " + sliceLengthInSamples)

        var correlatedAudioBuffer = mutableListOf<Double>()

        for (i in 0 until (numberTotalSamples / bufferLengthInSamples).toInt()) {
            correlatedAudioBuffer.add(440.0)
        }

        console.log("Correlated buffer: " + correlatedAudioBuffer)

        //take the correlated buffer and convert it to slices

        
    }

}