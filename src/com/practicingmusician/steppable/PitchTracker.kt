package com.practicingmusician.steppable

/**
 * Created by jn on 6/7/17.
 */


external fun setupMedia()
external fun updatePitch(timestamp: Double) : Double
external fun getSampleRate() : Int
external var buflen : Int

class PitchTracker : TimeKeeperSteppable {

    //sample rate of the microphone should be static
    val sampleRate = 44100.0

    //length of the preroll to ignore before we start tracking the pitch
    var lengthOfPrerollToIgnore = 0.0

    //this is assumed to start at timestamp 0
    val samples = mutableListOf<Double>()

    fun setup() {

    }

    override fun start() {
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

        //the pitch for the buffer of length buflen was ac -- we should store that time
        val lengthOfBuffer = (com.practicingmusician.steppable.buflen / 2.0) / com.practicingmusician.steppable.getSampleRate().toDouble() //this result is in seconds
        val timestampOfPitch = timestamp - lengthOfBuffer * 1000.0 //convert seconds to MS

        println("Buffer started at timestamp: " + timestampOfPitch)

        //timestamp at the end of the samples array
        val currentTimestampOfSamplesBuffer = samples.count() / sampleRate * 1000.0

        //remove the offset of the preroll
        var timestampOffsetWithPreroll = timestamp - lengthOfPrerollToIgnore

        //the number of samples that we should fill with the new frequency value
        val samplesToFill = (timestampOffsetWithPreroll - currentTimestampOfSamplesBuffer) * sampleRate / 1000.0

        if (samplesToFill < 0) {
            println("Not filling yet...")
            return
        }

        //fill the samples buffer with the correct number of frequency items
        //Basically, if someone played the note A(440) for one second, we should have 44100 items in the samples buffer
        //that are all equal to 440.0 (or variations when the intonation varies)
        println("Filling " + samplesToFill)
        for (i in 0 until samplesToFill.toInt()) {
            samples.add(correlatedFrequency)
        }
    }


}