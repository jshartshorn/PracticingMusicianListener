package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import kotlin.browser.window

/**
 * Created by jn on 6/23/17.
 *
 *
 * This class deals with converting the microphone samples into notes and notes into samples
 *
 */
class IncrementalBufferManager {

    //must be set so that it knows how long a beat should be
    var tempo = 0.0

    //sample rate should be constant
    val sampleRate = 44100.0

    //the minimum duration a note is assumed to be
    //so, if there's a note that is 0.1 beats long, we assume that it's an anomaly and ignore it
    val minDurationInBeats = 0.25

    //this stores the notes that have been converted from samples
    val notes = mutableListOf<Note>()

    /* State information about what has been converted */

    //the position in the sample array that has been convered so far
    var positionInSamples = 0

    /* End state */

    //This takes samples from the microphone and attempts to convert them into meaningful Notes
    //It attempts to do some smart analysis, including getting rid of short values
    //and then stitching the remaining like-values together
    fun convertSamplesBufferToNotes(samples : List<Double>) : List<Note> {

        val functionStartTimestamp = window.performance.now()

        val secondsPerBeat = 60.0 / tempo

        //get only the samples we haven't tested yet
        val samplesSublist = samples.subList(positionInSamples,samples.count() - 1)

        //get the note number for each sample in the buffer
        val noteNumbers = samplesSublist.map {
            Note.getNoteNumber(it)
        }

        //tie the samples to the note numbers, so we know which is which
        val pairs = samplesSublist.zip(noteNumbers)

        println("After mapping and zipping: " + (window.performance.now() - functionStartTimestamp))

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

        println("After making pairs: " + (window.performance.now() - functionStartTimestamp))

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
                //the new note number doesn't equal that last one
                //this is starting a new note -- put the last one in

                if (curLengthInSamples > 0) {

                    //find the duration
                    val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
                    val noteNum = curNoteNumber

                    //calculate the average frequency
                    avgFreq = avgFreq / curLengthInSamples

                    val note = Note(noteNum,durationInBeats)

                    note.avgFreq = avgFreq

                    notes.add(note)
                }

                //reset the values for the next one
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

        val functionEndTimestamp = window.performance.now()

        println("Function total time: " + (functionEndTimestamp - functionStartTimestamp))

        return notes
    }

}