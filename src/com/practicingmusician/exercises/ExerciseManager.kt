package com.practicingmusician.exercises

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.finals.BufferManager
import com.practicingmusician.steppable.Metronome
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.TimeKeeperAnalyzer
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper

/**
 * Created by jn on 6/6/17.
 */
class ExerciseManager(am : AudioManager) : TimeKeeperAnalyzer {


    var currentExercise : ExerciseDefinition? = null

    var timeKeeper = TimeKeeper()
    var metronome = Metronome()
    var pitchTracker = PitchTracker()

    var audioManager = am

    init {
        println("Init")
        createSteppables()
        setup()
    }

    fun createSteppables() {
        timeKeeper = TimeKeeper()
        metronome = Metronome()
        pitchTracker = PitchTracker()
    }

    fun setup() {
        println("Setup")
        metronome.audioManager = audioManager
        timeKeeper.steppables.add(metronome)
        timeKeeper.steppables.add(pitchTracker)

        timeKeeper.analyzers.add(this)

        timeKeeper.finishedActions.add {
            //take the pitch and convert it
            audioManager.cancelAllAudio()

            val notesFromSamplesBuffer = BufferManager.convertSamplesBufferToNotes(pitchTracker.samples)
            println("Notes: ")
            notesFromSamplesBuffer.forEach {
                println("Note: " + it.noteNumber + " for " + it.duration)
            }

        }

        metronome.setup()

        pitchTracker.setup()
    }

    @JsName("run")
    fun run() {
        metronome.start()
        pitchTracker.start()
        timeKeeper.start()
    }

    fun stop() {
        timeKeeper.stop()
        metronome.stop()
        pitchTracker.stop()
    }

    @JsName("loadExercise")
    fun loadExercise() {
        loadSampleExercise()

        currentExercise?.let {
            metronome.tempo = it.tempo
            timeKeeper.runForTime = it.getLength()
            println("Loaded exercise of length " + timeKeeper.runForTime)
        }
    }


    fun loadSampleExercise() {
        val exercise = ExerciseDefinition()
        exercise.tempo = 120.0
        exercise.notes.add(Note(60,1.0))
        exercise.notes.add(Note(61,1.0))
        exercise.notes.add(Note(62,1.0))
        exercise.notes.add(Note(63,1.0))
        exercise.notes.add(Note(64,1.0))

        currentExercise = exercise
    }


    override fun analyze(timestamp: Double) {
        println("Analyzing at " + timestamp)
        //println("Pitch is " + pitch.currentPitch)
    }

}