package com.practicingmusician.tests

import com.practicingmusician.PitchTracker
import com.practicingmusician.finals.BufferManager
import com.practicingmusician.finals.CompareEngine
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
        Note.createAllNotes()

        val exerciseSamples = TestBufferGenerator.generateExactBufferFromNotes(notes)

        val exactCopyGenerated = BufferManager.convertSamplesBufferToNotes(exerciseSamples)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies...")

        CompareEngine.compareNoteArrays(notes, copyWithAvgData)

        val copyWithVariedPitch = TestBufferGenerator.addPitchVariationToSamples(exerciseSamples)

        val copyWithVariedPitchNotes = BufferManager.convertSamplesBufferToNotes(copyWithVariedPitch)

        println("Comparing with pitch variation...")

        CompareEngine.compareNoteArrays(notes, copyWithVariedPitchNotes)

        val copyWithVariedRhythm = TestBufferGenerator.addRhythmVariationToSamples(exerciseSamples)

        val copyWithVariedRhythmNotes = BufferManager.convertSamplesBufferToNotes(copyWithVariedRhythm)

        println("Comparing with rhythm variation...")

        CompareEngine.compareNoteArrays(notes, copyWithVariedRhythmNotes)

        return "Done"
    }

    @JsName("oldRunTest")
    fun oldRunTest() : String {

        Note.createAllNotes()

        val exerciseSamples = BufferManager.convertNotesToSamples(notes)

        val generated = BufferManager.convertSamplesBufferToNotes(exerciseSamples)

        CompareEngine.compareNoteArrays(notes, generated)

        val micSamples = convertCorrelatedBuffersToSamples()

        val generatedFromCorrelations = BufferManager.convertSamplesBufferToNotes(micSamples)

        println("Comparing converted correlated buffers...")

        CompareEngine.compareNoteArrays(notes, generatedFromCorrelations)


        val tracker = PitchTracker()

        for (i in 24..1024 step 17) {
            tracker.mapNewBufferToSamples(listOf<Double>(),i.toDouble())
        }

        val generatedFromPitchTracker = BufferManager.convertSamplesBufferToNotes(tracker.samples)

        println("Comparing pitchTracker samples...")

        CompareEngine.compareNoteArrays(notes, generatedFromPitchTracker)


        //console.log("Number samples in exercise: " + exerciseSamples.count())
        //console.log("Number samples in mic input: " + micSamples.count())

        val exerciseDiv = document.getElementById("exercise") as HTMLElement
        exerciseDiv.textContent = "Samples : " + exerciseSamples

        val micDiv = document.getElementById("micInput") as HTMLElement
        micDiv.textContent = "Samples: " + tracker.samples


//        val slices = getPremadeSlices()
//
//        console.log("Number of slices: " + slices.count())
//
//        convertTimestampsToSlices()

        return "Done"
    }


    fun convertCorrelatedBuffersToSamples() : List<Double> {
        val lengthOfNotesInSeconds = notes.map { it.duration }.reduce { acc, d -> acc + d } * secondsPerBeat
        val numCorrelatedBuffers = lengthOfNotesInSeconds * sampleRate / bufferLengthInSamples

        console.log("Num correlated buffers: " + numCorrelatedBuffers)

        val correlatedBuffers = mutableListOf<Double>()
        val samplesPerCorrelatedBuffer = 1024

        for (i in 0 until numCorrelatedBuffers.toInt()) {
            correlatedBuffers.add(440.0) //for now
        }

        //put in fake values to test
        correlatedBuffers[1] = 880.0
        correlatedBuffers[2] = 440.0
        correlatedBuffers[3] = 880.0

        val samplesFromCorrelatedBuffers = mutableListOf<Double>()

        correlatedBuffers.forEach {
            for (i in 0 until samplesPerCorrelatedBuffer) {
                samplesFromCorrelatedBuffers.add(it)
            }
        }

        return samplesFromCorrelatedBuffers
    }


}