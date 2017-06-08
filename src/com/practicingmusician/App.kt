package com.practicingmusician

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.finals.BufferManager
import com.practicingmusician.steppable.Metronome
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.TimeKeeper

/**
 * Created by jn on 6/5/17.
 */

class App {
    val timeKeeper = TimeKeeper()
    val audioManager = AudioManager()
    var metronome = Metronome()
    var pitch = PitchTracker()

    var exerciseManager = ExerciseManager()

    fun setup() {
        metronome.audioManager = audioManager
        timeKeeper.steppables.add(metronome)
        timeKeeper.steppables.add(pitch)

        timeKeeper.analyzers.add(exerciseManager)

        timeKeeper.finishedActions.add {
            //take the pitch and convert it
            audioManager.cancelAllAudio()

            val notesFromSamplesBuffer = BufferManager.convertSamplesBufferToNotes(pitch.samples)
            println("Notes: ")
            notesFromSamplesBuffer.forEach {
                println("Note: " + it.noteNumber + " for " + it.duration)
            }
        }

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
            timeKeeper.runForTime = it.getLength()

            println("Loaded exercise of length " + timeKeeper.runForTime)
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