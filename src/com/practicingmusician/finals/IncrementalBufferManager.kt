package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/23/17.
 */
class IncrementalBufferManager {

    var tempo = 0.0


    val sampleRate = 44100.0
    val minDurationInBeats = 0.25

    val notes = mutableListOf<Note>()

    /* State information about what has been converted */

    var positionInSamples = 0



    /* End state */

    fun convertSamplesBufferToNotes(samples : List<Double>) : List<Note> {

        val secondsPerBeat = 60.0 / tempo

        val samplesSublist = samples.subList(positionInSamples,samples.count() - 1)

        //get the note number for each sample in the buffer
        val noteNumbers = samplesSublist.map {
            Note.getNoteNumber(it)
        }

        //tie the samples to the note numbers, so we know which is which
        val pairs = samplesSublist.zip(noteNumbers)

        //update our counter
        positionInSamples = samples.count() - 1

        //this will store groups of like-numbered sample/note pairs
        val groups = mutableListOf<List<Pair<Double,Int>>>()

        //go through the pairs and group them together with like-numbered sample/note pairs
        var curList = mutableListOf<Pair<Double,Int>>()
        var curNoteNumber = -1

        pairs.forEach {
            if (it.second == curNoteNumber) {
                curList.add(it)
            } else {
                if (curList.count() > 0) {
                    groups.add(curList)
                    curList = mutableListOf<Pair<Double,Int>>()
                }
            }
            curNoteNumber = it.second
        }
        if (curList.count() > 0) {
            groups.add(curList)
        }

        //remove groups that aren't long enough
        val groupsOfAcceptableLength = groups.filter {
            it.count() > (secondsPerBeat * minDurationInBeats * sampleRate)
        }

        println("Converted into number groups: " + groupsOfAcceptableLength.count() + " from original: " + groups.count())

        val flattened = groupsOfAcceptableLength.flatMap { it }

        //calculate the length of each group

        curNoteNumber = -1
        var curLengthInSamples = 0
        var avgFreq = 0.0

        for (pair in flattened) {
            var noteNumberFromSample = pair.second
            var freqFromSample = pair.first

            if (noteNumberFromSample != curNoteNumber) {
                //this is starting a new note -- put the last one in

                if (curLengthInSamples > 0) {

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

            avgFreq += freqFromSample
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

        console.log("Turned samples into these notes: " + notes)

        return notes
    }

}