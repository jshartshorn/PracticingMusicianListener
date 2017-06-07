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

    fun getFrequency() : Double {
        val A440_NoteNumber: Double = 69.0
        val equalTemperamentPitch = AppSettings.pitch * pow(2.0, (noteNumber.toDouble() - A440_NoteNumber) / 12.0)
        return equalTemperamentPitch
    }

    //fake this for now
    companion object {
        fun getNoteNumber(frequency : Double) : Int {
            return closestNoteToFrequency(frequency)
        }

        fun createAllNotes() {
            ALL_NOTES = mutableListOf<Note>()
            for (i in 0 until 128) {
                ALL_NOTES.add(Note(i,1.0))
            }
        }


        /*
        func closestNotes() -> [Note] {
        guard _closestNotesStored == nil else {
            return _closestNotesStored!
        }
        let sorted = Note.all.sorted { (first, second) -> Bool in
            if abs(first.frequency - frequency) > abs(second.frequency - frequency) {
                return false
            } else {
                return true
            }
        }
        self._closestNotesStored = Array(sorted.prefix(2))
        return _closestNotesStored!
    }
         */

        fun closestNoteToFrequency(frequency : Double) : Int {
            var closestFrequency = Double.MAX_VALUE
            var closestNoteValue = -1
            ALL_NOTES.forEach {
                var diff = abs(it.getFrequency() - frequency)
                if (diff < closestFrequency) {
                    closestFrequency = diff
                    closestNoteValue = it.noteNumber
                }
            }
            println("Returning " + closestNoteValue + " for freq " + frequency)
            return closestNoteValue
        }

    }
}

var ALL_NOTES = mutableListOf<Note>()


