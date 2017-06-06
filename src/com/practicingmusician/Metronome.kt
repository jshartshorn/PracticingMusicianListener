package com.practicingmusician

import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 */
class Metronome : TimeKeeperSteppable {

    final val audioKey = "metronomeSound"

    lateinit var audioManager : AudioManager

    override var state = TimeKeeper.TimeKeeperState.Stopped

    var tempo : Double = 120.0
    var currentBeat : Int = 0

    val beatTimes = mutableListOf<Double>()

    // Timestamp of the last beat that happened
    var lastBeatOccuredAt = -1.0

    fun setup() {
        audioManager.loadAudioFile("Cowbell.wav",audioKey)
    }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {
        val beatSize = 1000.0 * 60.0 / tempo

        if (lastBeatOccuredAt == -1.0) {
            //this is the first run
            lastBeatOccuredAt = timestamp - beatSize
        }

        //if the last beat hasn't even occured yet, don't bother calculating the next one
        if (lastBeatOccuredAt > timestamp) {
            return
        }

        //calculate when the new beat will happen
        val newTime = lastBeatOccuredAt + beatSize

        //how long from now will it happen
        val difference = newTime - timestamp

        audioManager.playAudio(audioKey,difference.toInt())

        println("Going to play at " + newTime.toInt())

        lastBeatOccuredAt = newTime

        beatTimes.add(newTime)
        currentBeat++

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
