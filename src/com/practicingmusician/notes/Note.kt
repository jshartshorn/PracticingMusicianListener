package com.practicingmusician.notes

import com.practicingmusician.AppSettings
import kotlin.js.Math.abs
import kotlin.js.Math.pow

/**
 * Created by jn on 6/6/17.
 */
class Note(value : Int, dur : Double) {

    val noteNumber = value
    val duration = dur

    var avgFreq : Double? = null

    fun getFrequency() : Double {
        val A440_NoteNumber: Double = 69.0
        val equalTemperamentPitch = AppSettings.pitch * pow(2.0, (noteNumber.toDouble() - A440_NoteNumber) / 12.0)
        return equalTemperamentPitch
    }

    companion object {
        fun getNoteNumber(frequency : Double) : Int {
            return closestNoteToFrequency(frequency)
        }

        fun createAllNotes() {
            ALL_NOTES = mutableListOf<Note>()
            for (i in 30 until 90) {
                ALL_NOTES.add(Note(i,1.0))
            }
        }

        fun closestNoteToFrequency(frequency : Double) : Int {
            var closestFrequency = Double.MAX_VALUE
            var closestNoteValue = -1

            for (note in ALL_NOTES) {
                var diff = abs(note.getFrequency() - frequency)
                if (diff < closestFrequency) {
                    closestFrequency = diff
                    closestNoteValue = note.noteNumber
                } else if (diff > closestFrequency) {
                    break
                }
            }
            //println("Returning " + closestNoteValue + " for freq " + frequency)
            return closestNoteValue
        }




    }
}

var ALL_NOTES = mutableListOf<Note>()


