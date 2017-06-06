package com.practicingmusician.exercises

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 */
class ExerciseManager {

    var currentExercise : ExerciseDefinition? = null


    fun loadSampleExercise() {
        val exercise = ExerciseDefinition()
        exercise.notes.add(Note(60,1.0))
        exercise.notes.add(Note(61,1.0))
        exercise.notes.add(Note(62,1.0))
        exercise.notes.add(Note(63,1.0))
        exercise.notes.add(Note(64,1.0))

        currentExercise = exercise
    }

}