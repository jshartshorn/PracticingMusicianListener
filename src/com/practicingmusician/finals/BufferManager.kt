package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */
object BufferManager {

    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val sampleRate = 44100.0
    val minDurationInBeats = 0.25

    fun convertSamplesBufferToNotes(samples : List<Double>) : List<Note> {
        //later, we will need to be able to do approx. frequencies -- for now, absolute values will be fine
        val notes = mutableListOf<Note>()

        var curNoteNumber = -1
        var avgFreq = 0.0
        var curLengthInSamples = 0

        for (sample in samples) {

            val noteNumberFromSample = Note.getNoteNumber(sample)

            if (noteNumberFromSample != curNoteNumber) {
                //this is starting a new note -- put the last one in

                if (curLengthInSamples > 0) {
                    //TODO: if the sample isn't long enough, don't add it

                    val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
                    val noteNum = curNoteNumber

                    avgFreq = avgFreq / curLengthInSamples

                    val note = Note(noteNum,durationInBeats)

                    note.avgFreq = avgFreq

                    notes.add(note)
                }

                avgFreq = 0.0
                curLengthInSamples = -1
            }

            avgFreq += sample
            curNoteNumber = noteNumberFromSample
            curLengthInSamples += 1
        }

        //get the last item
        if (curLengthInSamples > 0) {
            val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
            val noteNum = curNoteNumber

            avgFreq = avgFreq / curLengthInSamples

            val note = Note(noteNum,durationInBeats)
            note.avgFreq = avgFreq

            notes.add(note)
        }

        println("Length before purge: " + notes.count())

        //scan through and remove any that are too short?
        val notesCopy = notes.toMutableList()
        notes.forEach {
            if (it.duration < minDurationInBeats) {
                notesCopy.remove(it)
            }
        }

        println("Length after purge: " + notesCopy.count())

        console.log("Turned samples into these notes: " + notesCopy)

        return notesCopy
    }


    fun convertNotesToSamples(notes : List<Note>) : List<Double> {
        val samples = mutableListOf<Double>()
        val noteChangeIndexes = mutableListOf<Int>()
        notes.forEach {
            noteChangeIndexes.add(samples.count())
            val numSamplesToCreate = it.duration * secondsPerBeat * sampleRate
            val freq = it.getFrequency()
            for (i in 0 until numSamplesToCreate.toInt()) {
                samples.add(freq)
            }
        }
        console.log("Note change indexes: " + noteChangeIndexes)
        return samples
    }

}