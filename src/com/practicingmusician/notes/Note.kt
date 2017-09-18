package com.practicingmusician.notes

import com.practicingmusician.UserSettings
import com.practicingmusician.finals.FeedbackMetric
import com.practicingmusician.finals.listenerApp
import com.practicingmusician.finals.throwSafeIncorrectSwitch
import com.practicingmusician.pm_log
import kotlin.js.Math.abs
import kotlin.js.Math.pow

/**
 * Created by jn on 6/6/17.
 */
class Note(value : Int, dur : Double, textVal : String = "none") {

    //The MIDI note number
    val noteNumber = value

    //duration in beats
    var duration = dur

    //the textValue -- currently in VexFlow EasyScore format -- eg C4/q
    val textValue = textVal

    //if this is a note generated from samples, the average frequency over the total duration of the note
    var avgFreq : Double? = null

    //get the frequency based on the note number
    fun getFrequency() : Double {
        return Note.getFrequencyForNoteNumber(this.noteNumber)
    }

    fun noteName() : String {
      if (this.noteNumber == -1) { return "NaN" }
      val baseNote = fun(value : Int) : Int {
        if (value < 0) {
            return (value + 12) % 12
        } else {
            return value % 12
        }
      }(this.noteNumber)

      if (baseNote >= Note.noteNames.size) {
          console.warn("Invalid note")
          return "NaN"
      }
      return Note.noteNames[baseNote]
    }

    companion object {
        val noteNames = arrayOf("C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B")

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

        //TODO: replace this with closetNoteWithDiff
        //given a frequency, find the closest available MIDI note number
        fun closestNoteToFrequency(frequency : Double) : Int {
            var closestFrequency = Double.MAX_VALUE
            var closestNoteValue = -1

            for (note in ALL_NOTES) {
                val diff = abs(note.getFrequency() - frequency)
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

        data class NoteWithDiff(val note : Note, val differenceInFreq : Double, val differenceInCents : Double)

        fun closestNoteWithDiff(frequency: Double) : NoteWithDiff {
            var closestFrequency = Double.MAX_VALUE
            var closestNote : Note = Note(-1,0.0)
            var distanceInCents = 0.0

            if (frequency < ALL_NOTES[0].getFrequency() * 0.67 || frequency > ALL_NOTES.last().getFrequency() * 1.3 ) {
              return NoteWithDiff(closestNote, closestFrequency, distanceInCents)
            }

            for (note in ALL_NOTES) {
                val diff = abs(note.getFrequency() - frequency)
                if (diff < closestFrequency) {
                    closestFrequency = diff
                    closestNote = note
                } else if (diff > closestFrequency) {
                    break
                }
            }

            val idealItemFrequency = closestNote.getFrequency()
            val noteAboveFrequency = Note.getFrequencyForNoteNumber(closestNote.noteNumber + 1)
            val noteBelowFrequency = Note.getFrequencyForNoteNumber(closestNote.noteNumber - 1)

            if (frequency - idealItemFrequency > 0) {
              val distanceInHz = noteAboveFrequency - idealItemFrequency
              distanceInCents = ((frequency - idealItemFrequency) / distanceInHz) * 100.0
            } else if (frequency - idealItemFrequency < 0) {
              val distanceInHz = idealItemFrequency - noteBelowFrequency
              distanceInCents = ((idealItemFrequency - frequency) / distanceInHz) * 100.0
            }


            return NoteWithDiff(closestNote, closestFrequency, distanceInCents)
        }



    }
}

//global variable to store the generated note array
var ALL_NOTES = mutableListOf<Note>()


