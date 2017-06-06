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

        if (lastBeatOccuredAt > timestamp) {
            return
        }

        val newTime = lastBeatOccuredAt + beatSize

        val difference = newTime - timestamp

        audioManager.playAudio(audioKey,difference.toInt())

        println("Going to play at " + newTime.toInt())

        lastBeatOccuredAt = newTime
    }
}
