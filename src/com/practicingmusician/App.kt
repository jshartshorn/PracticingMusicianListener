package com.practicingmusician

/**
 * Created by jn on 6/5/17.
 */

class App {
    val timeKeeper = TimeKeeper()
    val audioManager = AudioManager()
    var metronome = Metronome()
    var pitch = Pitch()

    fun setup() {
        metronome.audioManager = audioManager
        timeKeeper.steppables.add(metronome)
        timeKeeper.steppables.add(pitch)

        metronome.setup()
        metronome.start()

        pitch.setup()
        pitch.start()
    }

    fun run() {
        timeKeeper.start()
    }

}