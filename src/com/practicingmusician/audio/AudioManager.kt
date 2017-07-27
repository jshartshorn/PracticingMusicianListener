package com.practicingmusician.audio

import com.practicingmusician.Audio
import com.practicingmusician.pm_log
import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 *
 *
 * This file manages the laoding and playing of audio resources.
 * Right now, this is used to play the metronome sounds
 *
 */

class AudioManager {

    //mutable map that stores the audio files with a key
    val loadedAudio = mutableMapOf<String, Audio>()

    //keys of the setTimeout calls -- used to cancel them in case the metronome stops
    val timeoutKeys = mutableListOf<Int>()

    fun loadAudioFile(filename : String, key : String) : Audio {
        val audio = Audio(filename)
        loadedAudio[key] = audio
        return audio
    }

    //play the audio right now
    fun playAudioNow(key : String) {
        pm_log("**** (( Playing...",6)
        val audio = loadedAudio[key]
        audio?.currentTime = 0
        audio?.play()
    }

    //play the audio after a delay
    fun playAudio(key : String, atTime : Int) {
        val audio = loadedAudio[key]

        val timeoutKey = window.setTimeout({
            pm_log("(( Playing..." + atTime,6)
            audio?.currentTime = 0
            audio?.play()
        }, atTime)

        timeoutKeys.add(timeoutKey)

    }

    //cancel all of the audio called with playAudio:atTime
    fun cancelAllAudio() {
        timeoutKeys.reversed().forEach {
            pm_log("Cancelling item... $it")
            window.clearTimeout(it)
        }
        timeoutKeys.removeAll { true }
    }

}
