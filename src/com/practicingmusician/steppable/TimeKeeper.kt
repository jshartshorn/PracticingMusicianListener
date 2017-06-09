package com.practicingmusician.steppable

import kotlin.browser.window


/**
 * Created by jn on 6/5/17.
 */

class TimeKeeper {

    var finishedActions = mutableListOf<() -> Unit>()

    enum class TimeKeeperState {
        Stopped, Running
    }

    var state : TimeKeeperState = TimeKeeperState.Stopped
        set(value) {
            field = value

            //when the state is set to stopped, do the finished actions
            if (value == TimeKeeperState.Stopped) {
                finishedActions.forEach {
                    it()
                }
            }
        }

    //the list of steppables that will be notified each time there is a step
    val steppables = mutableListOf<TimeKeeperSteppable>()

    val analyzers = mutableListOf<TimeKeeperAnalyzer>()

    /*
     * stores the offset time so that the beginning of our counter is 0 when the timer starts
     */
    var timeOffSet : Double = -1.0

    //Amount of time the analyzer should run for
    var runForTime : Double = 4100.0

    fun start() {
        state = TimeKeeperState.Running

        requestNextStep()
    }

    fun stop() {
        state = TimeKeeperState.Stopped
        timeOffSet = -1.0
    }

    fun requestNextStep() {
        window.requestAnimationFrame {
            this.step(it)
        }
    }

    //Gets called as often as possible
    fun step(nonOffsetTimestamp: Double) {

        if (timeOffSet == -1.0) {
            timeOffSet = nonOffsetTimestamp
        }

        val timestamp = nonOffsetTimestamp - timeOffSet

        /*
         * Go through each of the steppables and call step() on any of the that are currently running
         */

        println("Calling step at : " + timestamp + " (raw: $nonOffsetTimestamp)")

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
         * See if we need to changed to Stopped, since the length of the exercise is over
         */
        if (timestamp > runForTime) {
            this.state = TimeKeeperState.Stopped
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