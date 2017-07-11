package com.practicingmusician.steppable

import com.practicingmusician.pm_log
import kotlin.browser.window


/**
 * Created by jn on 6/5/17.
 *
 * This class is responsible for keeping time and delegating tasks to the metronome, pitchTracker, etc
 *
 */

class TimeKeeper {

    //list of closures to complete once the timeKeeper is stopped
    var finishedActions = mutableListOf<(completed : Boolean) -> Unit>()

    enum class TimeKeeperState {
        Stopped, Running, Completed
    }

    //current state
    //when this gets set, it calls the finishedActions if it has been set to Stopped
    var state : TimeKeeperState = TimeKeeperState.Stopped
        set(value) {
            if (value == TimeKeeperState.Completed) {
                pm_log("Completed",10)

                field = TimeKeeperState.Stopped

                //run the completed actions
                //when the state is set to completed, do the finished actions
                finishedActions.forEach {
                    it(true)
                }

            } else {
                field = value
            }
        }

    //the list of steppables that will be notified each time there is a step
    val steppables = mutableListOf<TimeKeeperSteppable>()

    //analyzers that will be run after each step
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

    //this is the function that keeps the steps going, by requesting animation frames from the window object
    //Theoretically, this should get about 60fps, or 16ms per step
    fun requestNextStep() {
        window.requestAnimationFrame {
            this.step(it)
        }
    }

    //Gets called by requestNextStep -- roughly 60fps
    fun step(nonOffsetTimestamp: Double) {

        //if this is the first run, set the timeOffset so that we can get a 0-based timestamp
        if (timeOffSet == -1.0) {
            timeOffSet = nonOffsetTimestamp
        }

        //this should be the 0-based timestamp
        val timestamp = nonOffsetTimestamp - timeOffSet

        /*
         * Go through each of the steppables and call step() on any of the that are currently running
         */

        pm_log("Calling step at : " + timestamp + " (raw: $nonOffsetTimestamp)")

        steppables.forEach {
            if (it.state == TimeKeeperState.Running)
                it.step(timestamp,this)
        }

        /*
         * Now that the steppables are done, do any analysis
         *
         * Right now, not really doing anything with this
         */
        analyzers.forEach {
            it.analyze(timestamp)
        }

        /*
         * See if we need to changed to Stopped, since the length of the exercise is over
         */
        if (timestamp >= runForTime) {
            pm_log("STOPPED ((((((((((((((((((((((((((((((())))))))))))))))))",9)
            this.state = TimeKeeperState.Completed
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
    //NOT CURRENTLY USED
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