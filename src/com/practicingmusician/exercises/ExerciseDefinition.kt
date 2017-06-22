package com.practicingmusician.exercises

import com.practicingmusician.notes.NotationItem
import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 *
 * This should define the exercise that the user is expected to play
 *
 */
class ExerciseDefinition {

    var notes = mutableListOf<Note>()

    var notationItems = mutableListOf<NotationItem>()

    var tempo : Double = 120.0

    fun getLength() : Double {
        val beatSize = 1000.0 * 60.0 / tempo
        return notes.map { it.duration }.reduce { acc, d -> d + acc } * beatSize
    }

    fun prerollLength(): Double {
        //TODO: make it real
        val beatSize = 1000.0 * 60.0 / tempo
        return beatSize * 4
    }

}