package com.practicingmusician.audio

import com.practicingmusician.Audio
import com.practicingmusician.pm_log
import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 *
 *
 *
 *
 */

class AudioManager {

    val loadedAudio = mutableMapOf<String, Audio>()

    val timeoutKeys = mutableListOf<Int>()

    fun loadAudioFile(filename : String, key : String) : Audio {
        val audio = Audio(filename)
        loadedAudio[key] = audio
        return audio
    }

    fun playAudioNow(key : String) {
        pm_log("**** (( Playing...",6)
        val audio = loadedAudio[key]
        audio?.currentTime = 0
        audio?.play()
    }

    fun playAudio(key : String, atTime : Int) {
        val audio = loadedAudio[key]

        val timeoutKey = window.setTimeout({
            pm_log("(( Playing..." + atTime,6)
            audio?.currentTime = 0
            audio?.play()
        }, atTime)

        timeoutKeys.add(timeoutKey)

    }

    fun cancelAllAudio() {
        timeoutKeys.reversed().forEach {
            pm_log("Cancelling item... $it")
            window.clearTimeout(it)
        }
        timeoutKeys.removeAll { true }
    }

}