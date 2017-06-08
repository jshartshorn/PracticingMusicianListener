package com.practicingmusician.steppable

/**
 * Created by jn on 6/7/17.
 */


external fun setupMedia()
external fun updatePitch(timestamp: Double) : Double
external fun getSampleRate() : Int
external var buflen : Int

class PitchTracker : TimeKeeperSteppable {
    val sampleRate = 44100.0

    //this is assumed to start at timestamp 0
    val samples = mutableListOf<Double>()

    fun setup() {
        com.practicingmusician.steppable.setupMedia()
    }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override var state: TimeKeeper.TimeKeeperState = TimeKeeper.TimeKeeperState.Stopped

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {
        val correlatedFrequency = com.practicingmusician.steppable.updatePitch(timestamp)
        println("Timestamp: " + timestamp)

        println("Pitch: " + correlatedFrequency)

        //the pitch for the buffer of length buflen was ac -- we should store that time
        val lengthOfBuffer = (com.practicingmusician.steppable.buflen / 2.0) / com.practicingmusician.steppable.getSampleRate().toDouble() //this result is in seconds
        val timestampOfPitch = timestamp - lengthOfBuffer * 1000.0 //convert seconds to MS

        println("Buffer started at timestamp: " + timestampOfPitch)

        val currentTimestampOfSamplesBuffer = samples.count() / sampleRate * 1000.0

        //the number of samples that we should fill with the new frequency value
        val samplesToFill = (timestamp - currentTimestampOfSamplesBuffer) * sampleRate / 1000.0

        println("Filling " + samplesToFill)
        for (i in 0 until samplesToFill.toInt()) {
            samples.add(correlatedFrequency)
        }
    }


}