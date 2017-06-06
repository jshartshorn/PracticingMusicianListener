package com.practicingmusician.exercises

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 *
 * This should define the exercise that the user is expected to play
 *
 */
class ExerciseDefinition {

    var notes = mutableListOf<Note>()
    var tempo : Double = 120.0

}