package com.practicingmusician.steppable

import com.practicingmusician.AudioAnalyzer
import com.practicingmusician.notes.Note
import com.practicingmusician.pm_log

/**
 * Created by jn on 6/7/17.
 */

external var audioAnalyzer : AudioAnalyzer

var buflen : Int = 1024

data class SampleCollection(val freq : Double, val lengthInSamples : Int, val timestampInSamples : Int)

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

    override fun setInitialOffset(offset: Double) {
      //TODO: fill the initial samples?
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
        val correlatedFrequency = audioAnalyzer.updatePitch(timestamp)
        pm_log("Timestamp: " + timestamp)
        pm_log("Pitch: " + correlatedFrequency)
        val lengthOfBuffer = (com.practicingmusician.steppable.buflen / 2.0) //this result is in seconds

        stepWithFrequency(timestamp, correlatedFrequency, lengthOfBuffer, latencyTime)
    }

    fun stepWithFrequency(timestamp: Double, correlatedFrequency: Double, lengthOfBufferInSamples : Double, latencyTime : Int) {

        val timestampOfPitch = timestamp - (lengthOfBufferInSamples / this.sampleRate * 1000.0) - latencyTime

        //pm_log("Timestamp that the buffer starts at $timestampOfPitch")

        //val currentTimestampOfSamplesBuffer = samplesRecorded / sampleRate * 1000.0

        //pm_log("Current endpoint of the samples buffer : $currentTimestampOfSamplesBuffer")

        val timestampAccountingForPreroll = timestampOfPitch - lengthOfPrerollToIgnore

        pm_log("Timestamp accounting for preroll $timestampAccountingForPreroll")

        val samplesToFill = lengthOfBufferInSamples - samplesRecorded + timestampAccountingForPreroll * 44.1

        if (samplesToFill < 0) {
            pm_log("Not filling yet...")
            return
        }

        pm_log("Filling " + samplesToFill + " with $correlatedFrequency")

        samples.add(
          SampleCollection(correlatedFrequency, samplesToFill.toInt(),samplesRecorded)
        )

        samplesRecorded += samplesToFill.toInt()
    }

}
