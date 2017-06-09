package com.practicingmusician.finals

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/7/17.
 */
object BufferManager {

    val sampleRate = 44100.0
    val minDurationInBeats = 0.25

    fun convertSamplesBufferToNotes(samples : List<Double>, tempo : Double) : List<Note> {
        val secondsPerBeat = 60.0 / tempo

        val notes = mutableListOf<Note>()

        var curNoteNumber = -1

        val noteNumbers = samples.map {
            Note.getNoteNumber(it)
        }

        val pairs = samples.zip(noteNumbers)

        val groups = mutableListOf<List<Pair<Double,Int>>>()

        var curList = mutableListOf<Pair<Double,Int>>()
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

        val groupsOfAcceptableLength = groups.filter {
            it.count() > (secondsPerBeat * minDurationInBeats * sampleRate)
        }

        println("Converted into number groups: " + groupsOfAcceptableLength.count())

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


    fun convertNotesToSamples(notes : List<Note>, tempo : Double) : List<Double> {
        val samples = mutableListOf<Double>()
        val secondsPerBeat = 60.0 / tempo

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