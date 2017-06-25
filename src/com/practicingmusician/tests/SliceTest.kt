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

    fun exactIncrementalTest() {
        println("****** Beginning incremental test")
        //incremental
        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4

        var incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults,CompareEngine.compareNoteArrays(notes, copyWithAvgData))

        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(notes, copyWithAvgData))

    }

    fun rushedTest() {
        println("****** Beginning rushed test")

        val incrementalComparison = IncrementalComparisonEngine()


        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val rushedNotes = listOf(Note(69,0.5),Note(81,(1.0 - incrementalComparison.allowableRhythmMargin - .01)),Note(69,1.0),Note(81,1.0))

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(rushedNotes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        val expectedResults = CompareResults()
        expectedResults.correct = 1
        expectedResults.attempted = 4


        println("Comparing rushed...")
        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(notes, copyWithAvgData))
    }

    //TODO: I think that the effect of the short notes on the starting points gets ignored, which should probably not be the case
    fun shortNotesTest() {
        println("****** Beginning short notes test")

        val incrementalComparison = IncrementalComparisonEngine()


        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val notesWithShortNotes = listOf(Note(69,0.5),Note(32,0.11),Note(81,1.0),Note(69,1.0),Note(32,0.11),Note(81,1.0))

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notesWithShortNotes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4


        println("Comparing short notes...")
        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(notes, copyWithAvgData))
    }

    @JsName("runTest")
    fun runTest() : String {

        //setup
        Note.createAllNotes()

        //tests

        exactIncrementalTest()


        rushedTest()


        shortNotesTest()

        return "Done"

    }

    fun oldTests() {

        val exerciseSamples = TestBufferGenerator.generateExactBufferFromNotes(notes, tempo)

        val exactCopyGenerated = BufferManager.convertSamplesBufferToNotes(exerciseSamples, tempo)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4
        testShouldBe(expectedResults,CompareEngine.compareNoteArrays(notes, copyWithAvgData))


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