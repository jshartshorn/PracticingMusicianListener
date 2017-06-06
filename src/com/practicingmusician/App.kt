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

        timeKeeper.analyzers.add(exerciseManager)

        exerciseManager.pitch = pitch
        exerciseManager.metronome = metronome

        metronome.setup()

        pitch.setup()
    }

    @JsName("loadExercise")
    fun loadExercise() {
        exerciseManager.loadSampleExercise()

        exerciseManager.currentExercise?.let {
            metronome.tempo = it.tempo
        }

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