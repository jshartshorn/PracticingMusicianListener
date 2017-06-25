package com.practicingmusician.tests

import com.practicingmusician.finals.*
import com.practicingmusician.notes.Note
import kotlin.browser.window

/**
 * Created by jn on 6/7/17.
 */
object SliceTest {

    val notes = listOf(Note(69,0.5),Note(81,1.0),Note(69,1.0),Note(81,1.0))
    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val sampleRate = 44100.0
    val bufferLengthInSamples = 1024


    fun testShouldBe(ideal : CompareResults, testValue : CompareResults) {
        if (ideal.attempted == testValue.attempted && ideal.correct == testValue.correct) {
            println("---- PASSED -----")
        } else {
            window.alert("Failed")
            println("----- ***** FAILED ****** -----")
        }
    }

    @JsName("runTest")
    fun runTest() : String {

        //setup
        Note.createAllNotes()
        val exerciseSamples = TestBufferGenerator.generateExactBufferFromNotes(notes, tempo)


        //TODO: uncomment testShouldBe

        //tests

        val exactCopyGenerated = BufferManager.convertSamplesBufferToNotes(exerciseSamples, tempo)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4
        testShouldBe(expectedResults,CompareEngine.compareNoteArrays(notes, copyWithAvgData))


        //incremental
        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated2 = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData2 = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated2)

        println("Comparing exact copies (incremental)...")

        val expectedResults2 = CompareResults()
        expectedResults2.correct = 4
        expectedResults2.attempted = 4

        var incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults2,incrementalComparison.compareNoteArrays(notes, copyWithAvgData2))



        val copyWithVariedPitch = TestBufferGenerator.addPitchVariationToSamples(exerciseSamples)

        val copyWithVariedPitchNotes = BufferManager.convertSamplesBufferToNotes(copyWithVariedPitch, tempo)

        println("Comparing with pitch variation...")

        //testShouldBe(CompareResults(0,4),CompareEngine.compareNoteArrays(notes, copyWithVariedPitchNotes))




        val copyWithVariedRhythm = TestBufferGenerator.addRhythmVariationToSamples(exerciseSamples)

        val copyWithVariedRhythmNotes = BufferManager.convertSamplesBufferToNotes(copyWithVariedRhythm, tempo)

        println("Comparing with rhythm variation...")

        //testShouldBe(CompareResults(0,4),CompareEngine.compareNoteArrays(notes, copyWithVariedRhythmNotes))


        val copyWithShortItems = TestBufferGenerator.addShortItemsThatShouldBeRemoved(exerciseSamples)

        val copyWithShortItemsNotes = BufferManager.convertSamplesBufferToNotes(copyWithShortItems, tempo)

        println("Comparing with short values that should be removed...")

        //testShouldBe(CompareResults(4,4),CompareEngine.compareNoteArrays(notes, copyWithShortItemsNotes))


        //add an extraneous note in the middle to misalign the indexes

        //val notes =        listOf(Note(69,1.0),Note(81,1.0),Note(69,1.0),Note(81,1.0))
        val notesWithExtra = listOf(Note(69,1.0),Note(81,0.5),Note(60,0.5),Note(69,1.0),Note(81,1.0))

        val exerciseSamplesWithExtra = TestBufferGenerator.generateExactBufferFromNotes(notesWithExtra, tempo)

        val exactCopyGeneratedWithExtra = BufferManager.convertSamplesBufferToNotes(exerciseSamplesWithExtra, tempo)

        val copyWithAvgDataWithExtra = TestBufferGenerator.addAvgPitchToSamples(exactCopyGeneratedWithExtra)

        println("Comparing copies with extra note...")

        //testShouldBe(CompareResults(correct = 3,attempted = 4),CompareEngine.compareNoteArrays(notes, copyWithAvgDataWithExtra))



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