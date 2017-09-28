package com.practicingmusician.tests

import com.practicingmusician.ComparisonFlags
import com.practicingmusician.EasyScoreCode
import com.practicingmusician.ListenerApp
import com.practicingmusician.finals.CompareResults
import com.practicingmusician.finals.IncrementalBufferManager
import com.practicingmusician.finals.IncrementalComparisonEngine
import com.practicingmusician.jsMusicXMLConverter
import com.practicingmusician.notes.Note

/**
 * Created by jn on 9/28/17.
 */

external fun loadXml(url : String, callback: (String) -> Unit)

object BigTest {

  val tempo = 120.0

  fun loadContent() {
    val xmlURL = "xml/Alto Finals/Song Library 1/Alto Sax - 1 - Hot Cross Buns.xml"

    loadXml("pm-listener/" + xmlURL, { callbackData ->

      console.log("Callback:")
      //console.log(callbackData)

      val converter = jsMusicXMLConverter()
      val json = converter.convertXMLToJSON(callbackData)

      console.log("JSON:")
      //console.log(json)

      val jsCode = converter.convertJSON(json)

      val exercise = jsCode.easyScoreInfo

      this.runTestOnExercise(exercise)
    })
  }

  fun runTestOnExercise(exercise : EasyScoreCode) {
    console.log("Running tests...")

    val incrementalComparison = IncrementalComparisonEngine()
    val incrementalBufferManager = IncrementalBufferManager()

    val noteObjects = TestBufferGenerator.simpleNotesToNote(exercise.notes)

    val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(noteObjects, this.tempo)

    val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

    val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

    val expectedResults = CompareResults()
    expectedResults.correct = 2
    expectedResults.attempted = 4


    val comparisonFlags = ComparisonFlags(testPitch = false,testDuration = true,testRhythm = true)

    println("Comparing rushed...")
    SliceTest.testShouldBe(expectedResults, incrementalComparison.compareNoteArrays(comparisonFlags, noteObjects, copyWithAvgData))

  }

  @JsName("runTest")
  fun runTest() {

        listenerApp = ListenerApp()
        listenerApp.parameters = MockParameters()
        listenerApp.setTempoForTests(this.tempo)
        //setup
        Note.createAllNotes()

        this.loadContent()

  }

}
