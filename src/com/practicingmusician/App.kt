package com.practicingmusician

import com.practicingmusician.exercises.ExerciseManager

/**
 * Created by jn on 6/5/17.
 */

class App {
    val timeKeeper = TimeKeeper()
    val audioManager = AudioManager()
    var metronome = Metronome()
    var pitch = Pitch()

    var exerciseManager = ExerciseManager()

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