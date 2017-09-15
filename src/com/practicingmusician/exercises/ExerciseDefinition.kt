package com.practicingmusician.exercises

import com.practicingmusician.ListenerApp
import com.practicingmusician.UserSettings
import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 *
 * This should define the exercise that the user is expected to play
 *
 */


class ExerciseDefinition {

    var notes = mutableListOf<Note>()

    var prerollLengthInBeats = 4.0

    //the length of the exercise, in ms
    fun getLength() : Double {
        val beatSize = 1000.0 * 60.0 / listenerApp.getTempo()
        return notes.map { it.duration }.reduce { acc, d -> d + acc } * beatSize
    }

    //the length of the preroll, in ms
    fun prerollLength(): Double {
        val beatSize = 1000.0 * 60.0 / listenerApp.getTempo()
        return beatSize * this.prerollLengthInBeats
    }

}
