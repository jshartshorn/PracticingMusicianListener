package com.practicingmusician

import kotlin.js.Math

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
        //TODO: make this real
        REMOVE_THIS_COUNTER += 1
        if (REMOVE_THIS_COUNTER % 2 == 1) {
            var toRet = 440.0

            var randomAddition = Math.random() * 4.0

            return toRet + randomAddition
        } else {
            return 878.0
        }
    }

}