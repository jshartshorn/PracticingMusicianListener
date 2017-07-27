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

    fun getLength() : Double {
        val beatSize = 1000.0 * 60.0 / listenerApp.globalTempo
        return notes.map { it.duration }.reduce { acc, d -> d + acc } * beatSize
    }

    fun prerollLength(): Double {
        val beatSize = 1000.0 * 60.0 / listenerApp.globalTempo
        return beatSize * this.prerollLengthInBeats
    }

}
