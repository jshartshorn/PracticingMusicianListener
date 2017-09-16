package com.practicingmusician

import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper
import com.practicingmusician.steppable.TimeKeeperSteppable
import org.w3c.dom.HTMLElement
import kotlin.browser.window

/**
 * Created by jn on 8/23/17.
 */
class PMTuner : TimeKeeperSteppable {

  val msToIgnore = 500

  //current state of the Metronome
  override var state = TimeKeeper.TimeKeeperState.Stopped

  lateinit var textElement : HTMLElement
  lateinit var audioAnalyzer : AudioAnalyzer

  val timekeeper = TimeKeeper()

  /* State */
  var longTermNote : Note.Companion.NoteWithDiff? = null //once we pull out the short notes
    set (value : Note.Companion.NoteWithDiff?) {
      //console.log("Setting....")
      //if (field?.note?.noteNumber != value?.note?.noteNumber) {
        longTermStartTime = window.performance.now()
      //  console.log("restarting...")
      //}
      field = value
    }
  var longTermStartTime = 0.0

  var currentNote : Note.Companion.NoteWithDiff? = null
    set(value : Note.Companion.NoteWithDiff?) {
      if (field?.note?.noteNumber != value?.note?.noteNumber) {
        val noteNum = field?.note?.noteNumber
        val time = window.performance.now() - timerStartTime
        console.log("$noteNum for $time done")
        timerStartTime = window.performance.now()
      } else {
        if (window.performance.now() - timerStartTime >= msToIgnore) {
          if (field?.note?.noteNumber != longTermNote?.note?.noteNumber) {
            val time = window.performance.now() - timerStartTime
            val noteNum = field?.note?.noteNumber
            val oldNoteNum = longTermNote?.note?.noteNumber
            console.log("Resetting after $time to $noteNum from $oldNoteNum")
            this.longTermNote = field
          }
        }
      }
      field = value
    }
  var currentDiff : Double = 0.0
  var timerStartTime = 0.0

  /* End state */

  init {
      timekeeper.steppables.add(this)
  }

  fun setup() {   }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {

      val correlatedFrequency = this.audioAnalyzer.updatePitch(timestamp)

      if (correlatedFrequency == undefined) {
        this.currentNote = null
        return
      }

      val noteWithDiff = Note.closestNoteWithDiff(correlatedFrequency)

      val noteName = noteWithDiff.note.noteName()

      currentDiff = noteWithDiff.differenceInFreq

      this.currentNote = noteWithDiff

      val timeOnCurrentNoteInMs = (window.performance.now() - this.timerStartTime).toInt()

      val currentDiffRounded = currentDiff.toInt()
      val timeOnCurrentLongNote = ((window.performance.now() - this.longTermStartTime) / 1000.0).toInt()
      val longTermNoteName = longTermNote?.note?.noteName()
      textElement.innerHTML = "$longTermNoteName<br/>$timeOnCurrentLongNote<br/>Diff: $currentDiffRounded<br/>Absolute note: $noteName"
      //textElement.innerHTML = "$noteName : $correlatedFrequency<br/>Diff: $currentDiff<br/>Time on current note: $timeOnCurrentNoteInMs"

    }

  fun run() {

    this.start()
    timekeeper.runForTime = Double.MAX_VALUE
    timekeeper.start()

  }

  override fun setInitialOffset(offset: Double) {
    //Don't have to do anything, since we're just tuning
  }

}
