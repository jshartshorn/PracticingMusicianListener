package com.practicingmusician.steppable

import com.practicingmusician.exercises.VexFlowUtil
import org.w3c.dom.HTMLElement
import kotlin.browser.document
import kotlin.browser.window

external fun moveToPosition(beat : Double)
external fun highlightMetronomeItem(itemNumber : Int)

/**
 * Created by jn on 6/5/17.
 */
class Metronome : TimeKeeperSteppable {

    final val audioKey = "metronomeSound"

    lateinit var audioManager : com.practicingmusician.audio.AudioManager

    override var state = TimeKeeper.TimeKeeperState.Stopped

    var timeSignature = 4
    var prerollBeats = timeSignature

    var tempo : Double = 120.0
    var currentBeat : Int = 0

    val beatTimes = mutableListOf<Double>()

    // Timestamp of the last beat that happened
    var lastBeatOccuredAt = -1.0

    val timeoutKeys = mutableListOf<Int>()

    fun setup() {
        audioManager.loadAudioFile("audio/Cowbell.wav",audioKey)
    }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {
        val beatSize = 1000.0 * 60.0 / tempo

        if (timeKeeper.runForTime - timestamp < beatSize / 2) {
            console.log("Less than beat size..")
            //this keeps it from playing an extra beat at the end that actually doesn't exist during the exercise
            return
        }

        if (lastBeatOccuredAt == -1.0) {
            //this is the first run
            lastBeatOccuredAt = timestamp - beatSize
        }

        val nextBeatTime = lastBeatOccuredAt + beatSize


        var absoluteBeatPosition = timestamp / beatSize
        updateIndicatorUI(absoluteBeatPosition)

        if (timestamp >= nextBeatTime) {
            //TODO: wind to the specific time?
            audioManager.playAudioNow(audioKey)
            lastBeatOccuredAt = nextBeatTime

            updateMetronomeUI(currentBeat)

            currentBeat++
        }


    }

    fun oldStep(timestamp: Double, timeKeeper: TimeKeeper) {
        val beatSize = 1000.0 * 60.0 / tempo

        if (lastBeatOccuredAt == -1.0) {
            //this is the first run
            println("First run")
            lastBeatOccuredAt = timestamp - beatSize
        }

        //calculate when the new beat will happen
        val newTime = lastBeatOccuredAt + beatSize

        //how long from now will it happen
        val difference = newTime - timestamp

        var absoluteBeatPosition = timestamp / beatSize

        console.log("At beat : " + absoluteBeatPosition)

        updateIndicatorUI(absoluteBeatPosition)

        //if the last beat hasn't even occured yet, don't bother calculating the next one
        if (lastBeatOccuredAt > timestamp) {
            return
        }



        audioManager.playAudio(audioKey,difference.toInt())

        //TODO: Cancel these if stopped
        val curBeatCopy = currentBeat
        val timeoutKey = window.setTimeout({
            updateMetronomeUI(curBeatCopy)
        }, difference.toInt())

        timeoutKeys.add(timeoutKey)

        println("Going to play at " + newTime.toInt())

        lastBeatOccuredAt = newTime

        beatTimes.add(newTime)
        currentBeat++


    }

    fun cancelAllUIUpdates() {
        timeoutKeys.reversed().forEach {
            println("Cancelling item... $it")
            window.clearTimeout(it)
        }
        timeoutKeys.removeAll { true }
    }

    fun updateIndicatorUI(beat : Double) {
        moveToPosition(beat - prerollBeats)
    }

    fun updateMetronomeUI(beat : Int) {
        //val el = document.getElementById("metronome") as HTMLElement
        //el.textContent = "$beat"
        highlightMetronomeItem(beat % timeSignature)
    }

    /*
     * Given a certain timestamp, figure out which beat it belongs to
     */
    fun getBeatOfTimestamp(timestamp : Double) : Double {

        var firstItem = -1.0
        var secondItem = -1.0


        var lastItemBefore : Int

        for(index in beatTimes.indices) {
            val beat = beatTimes[index]

            if (beat > timestamp) {
                lastItemBefore = index - 1

                if (lastItemBefore == -1) {
                    //the timestamp is before the first beat
                    //TODO: This may not be right -- may have to make an artificial next beat for it
                    return -1.0
                }

                firstItem = beatTimes[lastItemBefore]
                secondItem = beat

                break
            }
        }

        if (firstItem == null) {
            return -1.0
        }

        val distanceBetweenBeats = secondItem - firstItem

        val distanceFromStampToFirstBeat = timestamp - firstItem

        val percentageThroughBeat = distanceFromStampToFirstBeat / distanceBetweenBeats

        //now we need to figure out the index of the beat and add it

        //TODO: ("This isn't the correct return value yet")
        return percentageThroughBeat
    }

}
