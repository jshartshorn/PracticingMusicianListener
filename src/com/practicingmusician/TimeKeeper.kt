package com.practicingmusician

import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 */

class TimeKeeper {

    enum class TimeKeeperState {
        Stopped, Running
    }

    var state : TimeKeeperState = TimeKeeperState.Stopped

    //the list of steppables that will be notified each time there is a step
    val steppables = mutableListOf<TimeKeeperSteppable>()

    val analyzers = mutableListOf<TimeKeeperAnalyzer>()

    /*
     * stores the offset time so that the beginning of our counter is 0 when the timer starts
     */
    var timeOffSet : Double = 0.0

    fun start() {
        timeOffSet = window.performance.now()
        state = TimeKeeperState.Running

        requestNextStep()
    }

    fun stop() {
        state = TimeKeeperState.Stopped
    }

    fun requestNextStep() {
        window.requestAnimationFrame {
            this.step(it)
        }
    }

    //Gets called as often as possible
    fun step(timestamp: Double) {

        /*
         * Go through each of the steppables and call step() on any of the that are currently running
         */

        steppables.forEach {
            if (it.state == TimeKeeperState.Running)
                it.step(timestamp,this)
        }

        /*
         * Now that the steppables are done, do any analysis
         */
        analyzers.forEach {
            it.analyze(timestamp)
        }

        /*
         * If the state hasn't been changed to Stopped, then request the next step
         */

        if (this.state != TimeKeeperState.Stopped)
            requestNextStep()
    }

    /*
     * Retrieves the current time, accounting for the timeOffset stored when the TimeKeeper was started
     */
    fun currentTime() : Double {
        return window.performance.now() - timeOffSet
    }

}

interface TimeKeeperSteppable {
    fun step(timestamp : Double, timeKeeper : TimeKeeper)
    fun start()
    fun stop()
    var state : TimeKeeper.TimeKeeperState
}

interface TimeKeeperAnalyzer {
    fun analyze(timestamp: Double)
}