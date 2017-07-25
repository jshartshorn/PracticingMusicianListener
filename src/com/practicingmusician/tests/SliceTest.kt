package com.practicingmusician.tests

import com.practicingmusician.*
import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.finals.*
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.SampleCollection
import com.practicingmusician.steppable.TimeKeeper
import kotlin.browser.window

/**
 * Created by jn on 6/7/17.
 */

external var listenerApp : ListenerApp

class MockParameters : AppSetupParameters {
  override val notationContainerName : String = "notationBody"
  override val metronomeContainerName : String = "metronomeContainer"

  override val userID : Int = 1
  override  val exerciseID: Int = 2

    //database endpoint for storing performance data
  override  val databaseEndpoint : String = ""

    //base URL of the app
  override  val url : String = ""

    //directory in which audio assets are stored
  override  val audioAssetPath : String = ""

    //the margins in which a note can vary from the ideal and still be considered acceptable
  override  val allowableCentsMargin : Int = 40
  override  val allowableRhythmMargin : Double = 0.25
  override val allowableDurationRatio: Double = 0.5

  override val comparisonFlags = ComparisonFlags(testPitch = true, testRhythm = true, testDuration = true)
}

object SliceTest {

    val notes = listOf(Note(69,0.5),Note(81,1.0),Note(69,1.0),Note(81,1.0))
    val tempo = 120.0
    val secondsPerBeat = 60.0 / tempo
    val sampleRate = 44100.0
    val bufferLengthInSamples = 1024

    fun testShouldBe(ideal : CompareResults, testValue : CompareResults) {
        println("Results " + testValue.correct + " / " + testValue.attempted)
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

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollectionFromPitchTracker)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4

        val incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))
    }

    fun trueIncrementalBufferAndComparisonTest() {
        //TODO: implement
    }

    fun trueIncrementalBufferTest() {
        val incrementalBufferManager = IncrementalBufferManager()

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

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val incrementalComparison = IncrementalComparisonEngine()

        for (index in 0..copyWithAvgData.count()) {
            val sublist = copyWithAvgData.subList(0,index)
            console.log("Sublist:" + sublist.count())
            console.log(sublist)

            testShouldBe(CompareResults(sublist.count(),sublist.count()),incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes,sublist))
            //CompareEngine.compareNoteArrays(notes, sublist)
        }

        //testShouldBe(expectedResults,incrementalComparison.results)

    }

    fun exactIncrementalTestInBulk() {
        println("****** Beginning incremental bulk test")
        //incremental
        val incrementalBufferManager = IncrementalBufferManager()

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing exact copies (incremental)...")

        val expectedResults = CompareResults()
        expectedResults.correct = 4
        expectedResults.attempted = 4

        val incrementalComparison = IncrementalComparisonEngine()

        testShouldBe(expectedResults,CompareEngine.compareNoteArrays(notes, copyWithAvgData.map { it.note }))

        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))

    }

    fun sharpTest() {
        println("****** Beginning sharp test")
        val incrementalComparison = IncrementalComparisonEngine()


        //incremental
        val incrementalBufferManager = IncrementalBufferManager()

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val sharpNoteOriginalFrequency = exactCopyGenerated[1].note.getFrequency()
        val nextNoteUpFrequency = Note.getFrequencyForNoteNumber(exactCopyGenerated[1].note.noteNumber + 1)
        val distanceInHz = nextNoteUpFrequency - sharpNoteOriginalFrequency
        val distanceToMoveInHz = distanceInHz * ((listenerApp.parameters.allowableCentsMargin + 1) / 100.0)

        println("Original freq: " + sharpNoteOriginalFrequency)
        println("Next note up $nextNoteUpFrequency distance $distanceInHz to move $distanceToMoveInHz")

        exactCopyGenerated[3].note.avgFreq =  sharpNoteOriginalFrequency + distanceToMoveInHz

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing sharp copy...")

        val expectedResults = CompareResults()
        expectedResults.correct = 3
        expectedResults.attempted = 4


        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))
    }

    fun flatTest() {
        println("****** Beginning flat test")
        val incrementalComparison = IncrementalComparisonEngine()


        //incremental
        val incrementalBufferManager = IncrementalBufferManager()

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(notes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val flatNoteOriginalFrequency = exactCopyGenerated[1].note.getFrequency()
        val nextNoteDownFrequency = Note.getFrequencyForNoteNumber(exactCopyGenerated[1].note.noteNumber - 1)
        val distanceInHz = flatNoteOriginalFrequency - nextNoteDownFrequency
        val distanceToMoveInHz = distanceInHz * ((listenerApp.parameters.allowableCentsMargin + 1) / 100.0)

        println("Original freq: " + flatNoteOriginalFrequency)
        println("Next note up $nextNoteDownFrequency distance $distanceInHz to move $distanceToMoveInHz")

        exactCopyGenerated[3].note.avgFreq =  flatNoteOriginalFrequency - distanceToMoveInHz

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        println("Comparing flat copy...")

        val expectedResults = CompareResults()
        expectedResults.correct = 3
        expectedResults.attempted = 4


        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))
    }

    fun rushedTest() {
        println("****** Beginning rushed test")

        val incrementalComparison = IncrementalComparisonEngine()


        val incrementalBufferManager = IncrementalBufferManager()

        val rushedNotes = listOf(Note(69,0.5),Note(81,(1.0 - listenerApp.parameters.allowableRhythmMargin - .01)),Note(69,1.0),Note(81,1.0))

        val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(rushedNotes, tempo)

        val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

        val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

        val expectedResults = CompareResults()
        expectedResults.correct = 2
        expectedResults.attempted = 4


        println("Comparing rushed...")
        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))
    }

    //TODO: I think that the effect of the short notes on the starting points gets ignored, which should probably not be the case
    fun shortNotesTest() {
        println("****** Beginning short notes test")

        val incrementalComparison = IncrementalComparisonEngine()


        val incrementalBufferManager = IncrementalBufferManager()

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
        testShouldBe(expectedResults,incrementalComparison.compareNoteArrays(listenerApp.parameters.comparisonFlags,notes, copyWithAvgData))
    }

    @JsName("runTest")
    fun runTest() : String {

        listenerApp = ListenerApp()
        listenerApp.parameters = MockParameters()
        listenerApp.setTempoForTests(this.tempo)

        //setup
        Note.createAllNotes()

        //tests

        exactIncrementalTestInBulk()


        rushedTest()


        shortNotesTest()

        //trueIncrementalBufferTest()

        pitchTrackerTest()

        trueIncrementalComparisonTest()

        sharpTest()

        flatTest()


        return "Done"

    }

}
