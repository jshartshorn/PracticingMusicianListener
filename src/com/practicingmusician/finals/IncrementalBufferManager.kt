package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import com.practicingmusician.pm_log
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

        pm_log("Converting how many samples: " + samplesSublist.count())

        val lengthOfSamplesInBeats = (samplesSublist.map { it.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        pm_log("Total length of samples in beats: $lengthOfSamplesInBeats")

        //get the note number for each sample in the buffer
        val noteNumbers = samplesSublist.map {
            Note.getNoteNumber(it.freq)
        }

        //tie the samples to the note numbers, so we know which is which
        //first item is the SampleCollection (frequency and length), second is the note number
        val collectedPairs = samplesSublist.zip(noteNumbers)

        //pm_log("Collected pairs:")
        //pm_log(collectedPairs)

        pm_log("After mapping and zipping: " + (window.performance.now() - functionStartTimestamp))


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
        //add the last one
        groups.add(curList)

        pm_log("After making pairs: " + (window.performance.now() - functionStartTimestamp))

        val lengthOfCollectedPairsInBeats = (collectedPairs.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        pm_log("Total length of collected pairs in beats: $lengthOfCollectedPairsInBeats")

        val lengthOfGroupsInBeats = (groups.flatMap { it }.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        pm_log("Total length of groups: $lengthOfGroupsInBeats")

        //pm_log("Groups:")
        //pm_log(groups)


        val BOGUS_NOTE_NUMBER = -100

        //tkae any groups that aren't of acceptable length, and assign BOGUS_NOTE_NUMBER to them so that they can be identified later
        val groupsOfAcceptableLength = groups.filter { it.count() != 0 }.map {
            val lengthOfGroupsInSamples = it.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d }
            //pm_log("Group length " + lengthOfGroupsInSamples + " for " + it.first().second)
            if (lengthOfGroupsInSamples < (secondsPerBeat * minDurationInBeats * sampleRate)) {
                //pm_log("Under threshold")
                return@map it.map {
                    Pair(it.first,BOGUS_NOTE_NUMBER)
                }
            } else {
                return@map it
            }
        }

        //pm_log("Groups:")
        //pm_log(groupsOfAcceptableLength)

        pm_log("Converted into number groups: " + groupsOfAcceptableLength.count() + " from original: " + groups.count())

        val flattened = groupsOfAcceptableLength.flatMap { it }

        val lengthOfAcceptableGroupsInBeats = (flattened.map { it.first.lengthInSamples }.reduce { acc, d -> acc + d } / sampleRate) / secondsPerBeat

        pm_log("Total length of acceptable groups pairs in beats: $lengthOfAcceptableGroupsInBeats")


        //pm_log(flattened)

        curNoteNumber = -1
        var curLengthInSamples = 0
        var avgFreq = 0.0

        //combine the groups into single Note objects for the correct duration and average frequency
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
        //add the last remaining one
        val lastNote = Note(curNoteNumber,curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate))
        avgFreq = avgFreq / curLengthInSamples
        lastNote.avgFreq = avgFreq
        noteList.add(lastNote)

        //get rid of the notes that have no duration
        notes.addAll(noteList.filter { it.duration != 0.0 })

        //take the notes, and make NotePlacements out of them, which record the beat placement of each note
        var pos = 0.0
        val notePlacements = notes.map {
            val np =  NotePlacement(it, pos)
            pos += it.duration
            return@map np
        }.filter { it.note.noteNumber != BOGUS_NOTE_NUMBER  } //filter out any that are bogus


        //print out the notes that we had before filtering the bogus ones, for comparison
//        pm_log("Turned samples into these notes (before purging): ")
//        notes.forEach {
//            pm_log("Note: " + it.noteNumber + " for " + it.duration)
//        }

        val lengthOfNotesInBeats = notes.map { it.duration }.reduce { acc, d -> acc + d }
        pm_log("Length of notes in beats: $lengthOfNotesInBeats")

        val functionEndTimestamp = window.performance.now()

        pm_log("Function total time: " + (functionEndTimestamp - functionStartTimestamp))

        //return notes

        return notePlacements
    }

}