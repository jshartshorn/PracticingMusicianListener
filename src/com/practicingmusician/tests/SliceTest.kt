package com.practicingmusician.tests

import com.practicingmusician.models.Slice
import com.practicingmusician.notes.Note
import org.w3c.dom.HTMLElement
import kotlin.browser.document

/**
 * Created by jn on 6/7/17.
 */
object SliceTest {

    val notes = listOf(Note(69,1.0),Note(81,1.0),Note(69,1.0),Note(81,1.0))
    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val slicesPerBeat = 32
    val sampleRate = 44100.0
    val bufferLengthInSamples = 1024


    @JsName("runTest")
    fun runTest() : String {

        val exerciseSamples = convertNotesToSamples()

        turnSamplesBufferIntoNotes(exerciseSamples)

        val micSamples = convertCorrelatedBuffersToSamples()

        console.log("Number samples in exercise: " + exerciseSamples.count())
        console.log("Number samples in mic input: " + micSamples.count())

        val exerciseDiv = document.getElementById("exercise") as HTMLElement
        exerciseDiv.textContent = "Samples : " + exerciseSamples

        val micDiv = document.getElementById("micInput") as HTMLElement
        micDiv.textContent = "Samples: " + micSamples


//        val slices = getPremadeSlices()
//
//        console.log("Number of slices: " + slices.count())
//
//        convertTimestampsToSlices()

        return "Done"
    }

    fun convertNotesToSamples() : List<Double> {
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

    fun turnSamplesBufferIntoNotes(samples : List<Double>) {
        //later, we will need to be able to do approx. frequencies -- for now, absolute values will be fine
        val notes = mutableListOf<Note>()

        var curFreq = -1.0
        var curLengthInSamples = 0

        for (sample in samples) {
            if (sample != curFreq) {
                //this is starting a new note -- put the last one in

                if (curLengthInSamples > 0) {
                    val durationInBeats = curLengthInSamples.toDouble() / (secondsPerBeat * sampleRate)
                    val noteNum = Note.getNoteNumber(curFreq)

                    notes.add(Note(noteNum,durationInBeats))
                }

                curLengthInSamples = -1
            }

            curFreq = sample
            curLengthInSamples += 1
        }

        console.log("Turned samples into these notes: " + notes)
    }


    fun 



    fun convertCorrelatedBuffersToSamples() : List<Double> {
        val lengthOfNotesInSeconds = notes.map { it.duration }.reduce { acc, d -> acc + d } * secondsPerBeat
        val numCorrelatedBuffers = lengthOfNotesInSeconds * sampleRate / bufferLengthInSamples

        console.log("Num correlated buffers: " + numCorrelatedBuffers)

        val correlatedBuffers = mutableListOf<Double>()

        for (i in 0 until numCorrelatedBuffers.toInt()) {
            correlatedBuffers.add(440.0) //for now
        }

        val samplesFromCorrelatedBuffers = mutableListOf<Double>()
        val samplesPerCorrelatedBuffer = 1024

        correlatedBuffers.forEach {
            for (i in 0 until samplesPerCorrelatedBuffer) {
                samplesFromCorrelatedBuffers.add(it)
            }
        }

        return samplesFromCorrelatedBuffers
    }


    //Not using these right now....

    fun getPremadeSlices() : List<Slice> {
        val slices = mutableListOf<Slice>()

        notes.forEach {
            val numberSlices = it.duration * slicesPerBeat
            for (i in 0 until numberSlices.toInt()) {
                slices.add(Slice(it.getFrequency()))
            }
        }

        return slices
    }

    fun convertTimestampsToSlices() {
        val lengthOfNotesInSeconds = notes.map { it.duration }.reduce { acc, d -> acc + d } * secondsPerBeat
        val numberTotalSamples = sampleRate * lengthOfNotesInSeconds

        console.log("Length of notes in seconds: " + lengthOfNotesInSeconds)

        console.log("Total slices should be: " + (lengthOfNotesInSeconds / secondsPerBeat * slicesPerBeat))

        val sliceLengthInSamples = sampleRate * secondsPerBeat / slicesPerBeat

        console.log("Slice length in samples: " + sliceLengthInSamples)

        var correlatedAudioBuffer = mutableListOf<Double>()

        for (i in 0 until (numberTotalSamples / bufferLengthInSamples).toInt()) {
            correlatedAudioBuffer.add(440.0)
        } //gets 86 items

        //console.log("Correlated buffer: " + correlatedAudioBuffer)

        val slicesPerCorrelatedBufferItem = (bufferLengthInSamples / sliceLengthInSamples).toInt()

        console.log("Slices if converting the buffer: " + (slicesPerCorrelatedBufferItem * correlatedAudioBuffer.count()))

        //take the correlated buffer and convert it to slices


    }

}