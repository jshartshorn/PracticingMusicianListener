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

        pitch.setup()
    }

    @JsName("run")
    fun run() {
        metronome.start()
        pitch.start()
        timeKeeper.start()
    }

    fun stop() {
        timeKeeper.stop()
        metronome.stop()
        pitch.stop()
    }

    @JsName("toggleState")
    fun toggleState() {
        when (timeKeeper.state) {
            TimeKeeper.TimeKeeperState.Stopped -> this.run()
            TimeKeeper.TimeKeeperState.Running -> this.stop()
        }
    }

}