package com.practicingmusician.exercises

import com.practicingmusician.Metronome
import com.practicingmusician.Pitch
import com.practicingmusician.TimeKeeperAnalyzer
import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 */
class ExerciseManager : TimeKeeperAnalyzer {

    var currentExercise : ExerciseDefinition? = null

    lateinit var pitch : Pitch
    lateinit var metronome : Metronome


    fun loadSampleExercise() {
        val exercise = ExerciseDefinition()
        exercise.notes.add(Note(60,1.0))
        exercise.notes.add(Note(61,1.0))
        exercise.notes.add(Note(62,1.0))
        exercise.notes.add(Note(63,1.0))
        exercise.notes.add(Note(64,1.0))

        currentExercise = exercise
    }


    override fun analyze(timestamp: Double) {
        println("Analyzing at " + timestamp)
        println("Pitch is " + pitch.currentPitch)
    }

}