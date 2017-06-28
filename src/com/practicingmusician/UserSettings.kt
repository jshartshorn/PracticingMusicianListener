package com.practicingmusician

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 */

object UserSettings {
    val metronomeAudioOn = true
    val transposition = 0 //-2 would be Bb transposition
    val tempo = -1.0 //-1 if we don't want to change the value
    val pitch = 440


    fun applyToExercise(exerciseObject : GeneratedExercise) : GeneratedExercise {
        exerciseObject.notes = exerciseObject.notes.toList().map {
            if (UserSettings.transposition != 0) {
                val newNote = SimpleJSNoteObject(noteNumber = it.noteNumber + UserSettings.transposition, duration = it.duration)
                return@map newNote
            }

            return@map it
        }.toTypedArray()

        if (this.tempo != -1.0) {
            exerciseObject.tempo = this.tempo
        }

        return exerciseObject
    }
}