package com.practicingmusician.steppable

/**
 * Created by jn on 6/7/17.
 */


external fun setupMedia()
external fun updatePitch(timestamp: Double) : Double
external fun getSampleRate() : Int

var buflen : Int = 1024

data class SampleCollection(val freq : Double, val lengthInSamples : Int)

class PitchTracker : TimeKeeperSteppable {

    //sample rate of the microphone should be static
    val sampleRate = 44100.0

    //length of the preroll to ignore before we start tracking the pitch
    var lengthOfPrerollToIgnore = 0.0

    val latencyTime = 180

    //this is assumed to start at timestamp 0
    val samples = mutableListOf<SampleCollection>()

    /* State */

    var samplesRecorded = 0

    /* End state */

    fun setup() {

    }

    override fun start() {
        samplesRecorded = 0
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override var state: TimeKeeper.TimeKeeperState = TimeKeeper.TimeKeeperState.Stopped

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {

        //get the pitch at the current timestamp
        val correlatedFrequency = com.practicingmusician.steppable.updatePitch(timestamp)
        println("Timestamp: " + timestamp)
        println("Pitch: " + correlatedFrequency)
        val lengthOfBuffer = (com.practicingmusician.steppable.buflen / 2.0) //this result is in seconds

        stepWithFrequency(timestamp, correlatedFrequency, lengthOfBuffer, latencyTime)
    }

    fun stepWithFrequency(timestamp: Double, correlatedFrequency: Double, lengthOfBufferInSamples : Double, latencyTime : Int) {

        val timestampOfPitch = timestamp - (lengthOfBufferInSamples / 44100.0 * 1000.0) - latencyTime

        //println("Timestamp that the buffer starts at $timestampOfPitch")

        //val currentTimestampOfSamplesBuffer = samplesRecorded / sampleRate * 1000.0

        //println("Current endpoint of the samples buffer : $currentTimestampOfSamplesBuffer")

        val timestampAccountingForPreroll = timestampOfPitch - lengthOfPrerollToIgnore

        println("Timestamp accounting for preroll $timestampAccountingForPreroll")

        var samplesToFill = lengthOfBufferInSamples - samplesRecorded + timestampAccountingForPreroll * 44.1

        if (samplesToFill < 0) {
            println("Not filling yet...")
            return
        }

        println("Filling " + samplesToFill + " with $correlatedFrequency")

        samples.add(SampleCollection(correlatedFrequency, samplesToFill.toInt()))

        samplesRecorded += samplesToFill.toInt()
    }

}