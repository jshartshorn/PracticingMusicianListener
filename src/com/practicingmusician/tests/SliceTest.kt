package com.practicingmusician.tests

import com.practicingmusician.finals.*
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.SampleCollection
import com.practicingmusician.steppable.TimeKeeper
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

    fun pitchTrackerTest() {
        println("***** Pitch tracker test")

        val pt = PitchTracker()
        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val latencyTime = 0//180

        var timestamp : Double

        //do the preroll
        pt.lengthOfPrerollToIgnore = secondsPerBeat * 4 * 1000.0

        println("Sending preroll")
        pt.stepWithFrequency(pt.lengthOfPrerollToIgnore,1.0,pt.lengthOfPrerollToIgnore * 44.1, latencyTime)

        timestamp = pt.lengthOfPrerollToIgnore

        println("------")

        for (item in exerciseSamplesCollection) {
            timestamp += item.lengthInSamples / 44100.0 * 1000.0
            println("sending " + item.lengthInSamples + " at $timestamp")
            pt.stepWithFrequency(timestamp,item.freq,item.lengthInSamples.toDouble(),latencyTime)
            println("--------")
        }

        val originalSampleLength = exerciseSamplesCollection.map { it.lengthInSamples }.reduce { acc, i -> acc + i }
        val pitchTrackerSamplesLength = pt.samples.map { it.lengthInSamples }.reduce { acc, i -> acc + i  }
        println("Sample lengths :  $originalSampleLength | $pitchTrackerSamplesLength")

        val exerciseSamplesCollectionFromPitchTracker = pt.samples

        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollectionFromPitchTracker)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4

        val incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(notes, copyWithAvgData))
    }

    fun trueIncrementalBufferAndComparisonTest() {
        //TODO: implement
    }

    fun trueIncrementalBufferTest() {
        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionWithSize1FromNotes(notes, tempo)

        console.log("Starting with " + exerciseSamplesCollection.count())

        var runningListOfSampleCollections = mutableListOf<SampleCollection>()

        //incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        var curSampleIndex = 0
        var sampleSliceSize = 700
        while(true) {
            var endIndex = curSampleIndex + sampleSliceSize
            if (endIndex >= exerciseSamplesCollection.count()) {
                endIndex = exerciseSamplesCollection.count()
            }

            val sliceOfSamples = exerciseSamplesCollection.subList(curSampleIndex,endIndex)

            //console.log("Slice:" + sliceOfSamples.count())
            //console.log(sliceOfSamples.toList())

            runningListOfSampleCollections.addAll(sliceOfSamples)

            val notes = incrementalBufferManager.convertSamplesBufferToNotes(runningListOfSampleCollections)

            curSampleIndex += sampleSliceSize

            if (endIndex == exerciseSamplesCollection.count()) {
                break
            }

            console.log("Notes after slicing:")
            console.log(notes)
        }


    }

    fun trueIncrementalComparisonTest() {
        println("****** Beginning true incremental test")
        //incremental
        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val incrementalComparison = IncrementalComparisonEngine()

        for (index in 0..copyWithAvgData.count()) {
            val sublist = copyWithAvgData.subList(0,index)
            console.log("Sublist:" + sublist.count())
            console.log(sublist)

            testShouldBe(CompareResults(sublist.count(),sublist.count()),incrementalComparison.compareNoteArrays(notes,sublist))
            //CompareEngine.compareNoteArrays(notes, sublist)
        }

        //testShouldBe(expectedResults,incrementalComparison.results)

    }

    fun exactIncrementalTestInBulk() {
        println("****** Beginning incremental bulk test")
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

        val incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults,CompareEngine.compareNoteArrays(notes, copyWithAvgData.map { it.note }))

        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(notes, copyWithAvgData))

    }

    fun sharpTest() {
        println("****** Beginning sharp test")
        val incrementalComparison = IncrementalComparisonEngine()


        //incremental
        val incrementalBufferManager = IncrementalBufferManager()
        incrementalBufferManager.tempo = tempo

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        exactCopyGenerated[1].note.avgFreq = exactCopyGenerated[1].note.getFrequency() + incrementalComparison.allowableFreqencyMargin + 1

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing sharp copy...")

        val expectedResults = CompareResults()
        expectedResults.correct = 3
        expectedResults.attempted = 4


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
        expectedResults.correct = 2
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

        val notesWithShortNotes = //listOf(Note(69,0.5),Note(32,0.11),Note(34,0.11),Note(81,1.0),Note(69,1.0),Note(32,0.11),Note(34,0.11),Note(36,0.11),Note(81,1.0))

        listOf(
                //Note(35,0.05), //small value
                Note(69,0.31),
                Note(35,0.05), //small value
                Note(69,0.14), //small value

                Note(81,0.78),
                //Note(81,1.0),

                //extraneous
                Note(34,0.11),
                Note(35,0.11),
                //Note(37,0.11),

                Note(69,1.0),

                Note(81,1.0)
        )

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

        exactIncrementalTestInBulk()


        rushedTest()

        sharpTest()

        shortNotesTest()

        //trueIncrementalBufferTest()

        pitchTrackerTest()

        trueIncrementalComparisonTest()


        return "Done"

    }

}