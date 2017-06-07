package com.practicingmusician

/**
 * Created by jn on 6/7/17.
 */

class PitchTracker {
    val sampleRate = 44100.0

    var REMOVE_THIS_COUNTER = 0

    //this is assumed to start at timestamp 0
    val samples = mutableListOf<Double>()

    fun mapNewBufferToSamples(buffer : List<Double>, timestamp : Double) {
        val currentTimestampOfSamplesBuffer = samples.count() / sampleRate * 1000.0

        //the number of samples that we should fill with the new frequency value
        val samplesToFill = (timestamp - currentTimestampOfSamplesBuffer) * sampleRate / 1000.0

        println("Filling " + samplesToFill)

        val correlatedFrequency = getCorrelatedFrequencyOfBuffer(buffer)

        for (i in 0 until samplesToFill.toInt()) {
            samples.add(correlatedFrequency)
        }
    }

    fun getCorrelatedFrequencyOfBuffer(buffer: List<Double>) : Double {
        REMOVE_THIS_COUNTER += 1
        if (REMOVE_THIS_COUNTER % 2 == 1)
            return 440.0 // for now
        else
            return 880.0
    }

}