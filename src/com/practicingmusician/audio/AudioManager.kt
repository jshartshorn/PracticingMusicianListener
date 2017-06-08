package com.practicingmusician.audio

import kotlin.browser.window

/**
 * Created by jn on 6/5/17.
 *
 *
 *
 *
 */

external class Audio(filename : String)

class AudioManager {

    val loadedAudio = mutableMapOf<String, Audio>()

    val timeoutKeys = mutableListOf<Int>()

    fun loadAudioFile(filename : String, key : String) : Audio {
        val audio = Audio(filename)
        loadedAudio[key] = audio
        return audio
    }

    fun playAudio(key : String, atTime : Int) {
        val audio = loadedAudio[key]

        val timeoutKey = window.setTimeout({
            audio.asDynamic().currentTime = 0
            audio.asDynamic().play()
        }, atTime)

        timeoutKeys.add(timeoutKey)

    }

    fun cancelAllAudio() {
        timeoutKeys.reversed().forEach {
            println("Cancelling item...")
            window.clearTimeout(it)
        }
        timeoutKeys.removeAll { true }
    }

}