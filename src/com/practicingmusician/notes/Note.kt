package com.practicingmusician.notes

import com.practicingmusician.UserSettings
import kotlin.js.Math.abs
import kotlin.js.Math.pow

/**
 * Created by jn on 6/6/17.
 */
class Note(value : Int, dur : Double, textVal : String = "none") : NotationItem {

    //The MIDI note number
    val noteNumber = value

    //duration in beats
    val duration = dur

    //the textValue -- currently in VexFlow EasyScore format -- eg C4/q
    val textValue = textVal

    //if this is a note generated from samples, the average frequency over the total duration of the note
    var avgFreq : Double? = null

    //get the frequency based on the note number
    fun getFrequency() : Double {
        return Note.getFrequencyForNoteNumber(this.noteNumber)
    }

    companion object {
        //get the note number of a certain frequency
        fun getNoteNumber(frequency : Double) : Int {
            if (frequency == -1.0)
                return -1
            return closestNoteToFrequency(frequency)
        }

        //TODO: cache this for speed?
        fun getFrequencyForNoteNumber(noteNumber : Int) : Double {
            val A440_NoteNumber: Double = 69.0
            val equalTemperamentPitch = UserSettings.pitch * pow(2.0, (noteNumber.toDouble() - A440_NoteNumber) / 12.0)
            return equalTemperamentPitch
        }

        //create an array of notes (so that we can test for frequencies
        fun createAllNotes() {
            ALL_NOTES = mutableListOf<Note>()
            for (i in 30 until 110) {
                ALL_NOTES.add(Note(i,1.0))
            }
        }

        //given a frequency, find the closest available MIDI note number
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

//global variable to store the generated note array
var ALL_NOTES = mutableListOf<Note>()


