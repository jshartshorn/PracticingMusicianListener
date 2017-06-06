package com.practicingmusician

/**
 * Created by jn on 6/5/17.
 */

class App {
    val timeKeeper = TimeKeeper()
    val audioManager = AudioManager()
    var metronome = Metronome()

    fun setup() {
        metronome.audioManager = audioManager
        timeKeeper.steppables.add(metronome)

        metronome.setup()
        metronome.start()
    }

    fun run() {
        timeKeeper.start()
    }

}