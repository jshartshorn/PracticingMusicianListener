package com.practicingmusician

/**
 * Created by jn on 6/5/17.
 */


external fun setupMedia()
external fun updatePitch(timestamp: Double) : String

class Pitch : TimeKeeperSteppable {

    fun setup() {
        setupMedia()
    }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override var state: TimeKeeper.TimeKeeperState = TimeKeeper.TimeKeeperState.Stopped


    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {
        val ac = updatePitch(timestamp)
        println("Pitch: " + ac)
    }


}