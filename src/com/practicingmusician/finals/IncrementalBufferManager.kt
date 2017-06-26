package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.SampleCollection
import kotlin.browser.window

/**
 * Created by jn on 6/23/17.
 *
 *
 * This class deals with converting the microphone samples into notes and notes into samples
 *
 */

data class NotePlacement(val note : Note, val positionInBeats : Double)

class IncrementalBufferManager {

    //must be set so that it knows how long a beat should be
    var tempo = 0.0

    //sample rate should be constant
    val sampleRate = 44100.0

    //the minimum duration a note is assumed to be
    //so, if there's a note that is 0.1 beats long, we assume that it's an anomaly and ignore it
    val minDurationInBeats = 0.25

    //this stores the notes that have been converted from samples


    /* State information about what has been converted */

    //the position in the sample array that has been convered so far

    /* End state */

    //This takes samples from the microphone and attempts to convert them into meaningful Notes
    //It attempts to do some smart analysis, including getting rid of short values
    //and then stitching the remaining like-values together
    fun convertSamplesBufferToNotes(samples : List<SampleCollection>) : List<NotePlacement> {

        var positionInSamples = 0

        val notes = mutableListOf<Note>()

        if (samples.count() == 0) { return listOf() }

        val functionStartTimestamp = window.performance.now()

        val secondsPerBeat = 60.0 / tempo

        //get only the samples we haven't tested yet
        val samplesSublist = samples.subList(positionInSamples,samples.count())

        println("Converting how many samples: " + samplesSublist.count())

        val lengthOfSamplesInBeats = (samplesSublist.map { it.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        println("Total length of samples in beats: $lengthOfSamplesInBeats")

        //get the note number for each sample in the buffer
        val noteNumbers = samplesSublist.map {
            Note.getNoteNumber(it.freq)
        }

        //tie the samples to the note numbers, so we know which is which
        //first item is the SampleCollection (frequency and length), second is the note number
        val collectedPairs = samplesSublist.zip(noteNumbers)

        //console.log("Collected pairs:")
        //console.log(collectedPairs)

        println("After mapping and zipping: " + (window.performance.now() - functionStartTimestamp))


        //this will store groups of like-numbered sample/note pairs
        val groups = mutableListOf<List<Pair<SampleCollection,Int>>>()

        //go through the pairs and group them together with like-numbered sample/note pairs
        var curList = mutableListOf<Pair<SampleCollection,Int>>()
        var curNoteNumber = Int.MIN_VALUE

        collectedPairs.forEach {
            if (curNoteNumber != it.second) {
                //see if we should add it
                groups.add(curList)
                curList = mutableListOf()
            }
            curList.add(it)
            curNoteNumber = it.second
        }
        groups.add(curList)

        println("After making pairs: " + (window.performance.now() - functionStartTimestamp))

        val lengthOfCollectedPairsInBeats = (collectedPairs.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        println("Total length of collected pairs in beats: $lengthOfCollectedPairsInBeats")

        val lengthOfGroupsInBeats = (groups.flatMap { it }.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        println("Total length of groups: $lengthOfGroupsInBeats")

        //console.log("Groups:")
        //console.log(groups)

        //remove groups that aren't long enough
//        val groupsOfAcceptableLength = groups.filter {
//            //return@filter true
//
//            if (it.count() != 0) {
//                val lengthOfGroupsInSamples = it.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d }
//                //console.log("Group length " + lengthOfGroupsInSamples)
//                if (lengthOfGroupsInSamples > (secondsPerBeat * minDurationInBeats * sampleRate)) {
//                    return@filter true
//                }
//            }
//
//            return@filter false
//        }

        val BOGUS_NOTE_NUMBER = -100

        val groupsOfAcceptableLength = groups.filter { it.count() != 0 }.map {
            val lengthOfGroupsInSamples = it.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d }
            console.log("Group length " + lengthOfGroupsInSamples + " for " + it.first().second)
            if (lengthOfGroupsInSamples < (secondsPerBeat * minDurationInBeats * sampleRate)) {
                println("Under threshold")
                return@map it.map {
                    Pair(it.first,BOGUS_NOTE_NUMBER)
                }
            } else {
                return@map it
            }
        }

        console.log("Groups:")
        console.log(groupsOfAcceptableLength)

        println("Converted into number groups: " + groupsOfAcceptableLength.count() + " from original: " + groups.count())

        val flattened = groupsOfAcceptableLength.flatMap { it }

        val lengthOfAcceptableGroupsInBeats = (flattened.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        println("Total length of acceptable groups pairs in beats: $lengthOfAcceptableGroupsInBeats")


        //console.log(flattened)

        //calculate the length of each group
        curNoteNumber = -1
        var curLengthInSamples = 0
        var avgFreq = 0.0


//        collectedPairs.forEach {
//            if (curNoteNumber != it.second) {
//                //see if we should add it
//                groups.add(curList)
//                curList = mutableListOf()
//            }
//            curList.add(it)
//            curNoteNumber = it.second
//        }
//        groups.add(curList)

        var noteList = mutableListOf<Note>()
        flattened.forEach {
            if (curNoteNumber != it.second) {
                var note = Note(curNoteNumber,curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate))
                avgFreq = avgFreq / curLengthInSamples
                note.avgFreq = avgFreq
                noteList.add(note)
                curLengthInSamples = 0
                avgFreq = 0.0
            }
            curLengthInSamples += it.first.lengthInSamples
            avgFreq += (it.first.freq *it.first.lengthInSamples)
            curNoteNumber = it.second
        }
        noteList.add(Note(curNoteNumber,curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)))

        notes.addAll(noteList.filter { it.noteNumber != -1 })

        var pos = 0.0 //- (0.3 / secondsPerBeat)
        val notePlacements = notes.map {
            val np =  NotePlacement(it, pos)
            pos += it.duration
            return@map np
        }.filter { it.note.noteNumber != BOGUS_NOTE_NUMBER  }

//        for (pair in flattened) {
//            //console.log("Item")
//            val noteNumberFromSample = pair.second
//            val freqFromSample = pair.first.freq
//
//            if (noteNumberFromSample != curNoteNumber) {
//                //the new note number doesn't equal that last one
//                //this is starting a new note -- put the last one in
//
//                if (curLengthInSamples > 0) {
//
//                    //find the duration
//                    val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
//                    val noteNum = curNoteNumber
//
//                    //calculate the average frequency
//                    avgFreq = avgFreq / curLengthInSamples
//
//                    val note = Note(noteNum,durationInBeats)
//
//                    note.avgFreq = avgFreq
//
//                    //console.log("Adding note")
//                    notes.add(note)
//                }
//
//                //reset the values for the next one
//                avgFreq = 0.0
//                curLengthInSamples = 0
//            }
//
//            avgFreq += (freqFromSample * pair.first.lengthInSamples)
//            curNoteNumber = noteNumberFromSample
//            curLengthInSamples += pair.first.lengthInSamples
//        }
//
//        //get the last item
//        if (curLengthInSamples > 0) {
//            val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
//            val noteNum = curNoteNumber
//
//            avgFreq = avgFreq / curLengthInSamples
//
//            val note = Note(noteNum,durationInBeats)
//            note.avgFreq = avgFreq
//
//            notes.add(note)
//        }

        console.log("Turned samples into these notes: ")
        console.log(notes)

        val lengthOfNotesInBeats = notes.map { it.duration }.reduce { acc, d -> acc + d }
        println("Length of notes in beats: $lengthOfNotesInBeats")

        val functionEndTimestamp = window.performance.now()

        println("Function total time: " + (functionEndTimestamp - functionStartTimestamp))

        //return notes

        return notePlacements
    }

}