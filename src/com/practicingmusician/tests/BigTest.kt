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

  fun loadContent(xmlUrl : String) {

    loadXml("pm-listener/" + xmlUrl, { callbackData ->

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

    val originalNoteObjects = TestBufferGenerator.simpleNotesToNote(exercise.notes)

    val alteredNotes = mutableListOf<Note>()

    originalNoteObjects.forEach {
      if (it.noteNumber != -1) {
        //not a rest
        val factor = 0.76 //breaks at .75 for allowableRhythmMargin is set to .25
        alteredNotes.add(Note(it.noteNumber,it.duration * factor,""))
        alteredNotes.add(Note(-1,it.duration * (1.0 - factor),""))
      } else {
        alteredNotes.add(it)
      }
    }

    val exerciseSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(alteredNotes, this.tempo)

    val exactCopyGenerated = incrementalBufferManager.convertSamplesBufferToNotes(exerciseSamplesCollection)

    val copyWithAvgData = TestBufferGenerator.addAvgPitchToSamples(exactCopyGenerated)

    val expectedResults = CompareResults()
    expectedResults.correct = originalNoteObjects.size
    expectedResults.attempted = originalNoteObjects.size


    val comparisonFlags = ComparisonFlags(testPitch = false,testDuration = true,testRhythm = true)

    println("Comparing rushed...")
    //SliceTest.testShouldBe(expectedResults, incrementalComparison.compareNoteArrays(comparisonFlags, originalNoteObjects, copyWithAvgData))


    //now, shift everything over one beat and see if it still works

    val originalNotesShifted = mutableListOf<Note>()
    originalNotesShifted.add(Note(-1,1.0,""))
    originalNotesShifted.addAll(alteredNotes)

    val shiftedSamplesCollection = TestBufferGenerator.generateExactBufferCollectionFromNotes(originalNotesShifted, this.tempo)
    val shiftedSamplesBackToNotes = incrementalBufferManager.convertSamplesBufferToNotes(shiftedSamplesCollection)

    val shiftedWithAvgData = TestBufferGenerator.addAvgPitchToSamples(shiftedSamplesBackToNotes)

    val expectedResults2 = CompareResults()
    expectedResults2.correct = 0
    expectedResults2.attempted = 0

    SliceTest.testShouldBe(expectedResults2, incrementalComparison.compareNoteArrays(comparisonFlags, originalNoteObjects, shiftedWithAvgData))
  }

  @JsName("runTest")
  fun runTest(parameters: dynamic) {

        listenerApp = ListenerApp()
        listenerApp.parameters = MockParameters()
        listenerApp.setTempoForTests(this.tempo)
        //setup
        Note.createAllNotes()

        this.loadContent(parameters.xmlUrl)

  }

}
