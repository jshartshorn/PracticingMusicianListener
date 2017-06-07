package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */
object BufferManager {

    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val sampleRate = 44100.0

    fun turnSamplesBufferIntoNotes(samples : List<Double>) : List<Note> {
        //later, we will need to be able to do approx. frequencies -- for now, absolute values will be fine
        val notes = mutableListOf<Note>()

        var curFreq = -1.0
        var curLengthInSamples = 0

        for (sample in samples) {
            if (sample != curFreq) {
                //this is starting a new note -- put the last one in

                if (curLengthInSamples > 0) {
                    //TODO: if the sample isn't long enough, don't add it

                    val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
                    val noteNum = Note.getNoteNumber(curFreq)

                    notes.add(Note(noteNum,durationInBeats))
                }

                curLengthInSamples = -1
            }

            curFreq = sample
            curLengthInSamples += 1
        }

        //get the last item
        if (curLengthInSamples > 0) {
            val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
            val noteNum = Note.getNoteNumber(curFreq)

            notes.add(Note(noteNum,durationInBeats))
        }

        console.log("Turned samples into these notes: " + notes)

        return notes
    }

}