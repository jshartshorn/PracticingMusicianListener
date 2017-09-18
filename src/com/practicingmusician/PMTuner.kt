package com.practicingmusician

import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper
import com.practicingmusician.steppable.TimeKeeperSteppable
import org.w3c.dom.HTMLElement
import kotlin.browser.document
import kotlin.browser.window

/**
 * Created by jn on 8/23/17.
 */

enum class TunerModes { TUNER, STOPWATCH }

data class TunerParameters( val mode : String,
                            val acceptableCentsRange: Int,
                            val msToIgnore : Int,
                            val noteNameItem: String,
                            val diffItem: String,
                            val stopwatchTimerItem: String)

class PMTuner constructor(val parameters: TunerParameters): TimeKeeperSteppable {

  //current state of the Metronome
  override var state = TimeKeeper.TimeKeeperState.Stopped

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
        //val noteNum = field?.note?.noteNumber
        //val time = window.performance.now() - timerStartTime
        //console.log("$noteNum for $time done")
        timerStartTime = window.performance.now()
      } else {
        if (window.performance.now() - timerStartTime >= parameters.msToIgnore) {
          if (field?.note?.noteNumber != longTermNote?.note?.noteNumber) {
            //val time = window.performance.now() - timerStartTime
            //val noteNum = field?.note?.noteNumber
            //val oldNoteNum = longTermNote?.note?.noteNumber
            //console.log("Resetting after $time to $noteNum from $oldNoteNum")
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

      //The closest note to the played frequency
      val noteWithDiff = Note.closestNoteWithDiff(correlatedFrequency)

      //The difference in Hz to the closest note
      currentDiff = noteWithDiff.differenceInFreq

      this.currentNote = noteWithDiff

      val timeOnCurrentLongNote = ((window.performance.now() - this.longTermStartTime) / 1000.0)
      val longTermNoteName = longTermNote?.note?.noteName()

      longTermNoteName?.let {
        document.getElementById(parameters.noteNameItem)?.innerHTML = it
      }

      if (parameters.mode == TunerModes.STOPWATCH.name) {
        document.getElementById(parameters.stopwatchTimerItem)?.innerHTML = "$timeOnCurrentLongNote"
      }

      when (TunerModes.valueOf(parameters.mode)) {
        TunerModes.STOPWATCH -> calculateStopwatchMedals(timeOnCurrentLongNote)
        TunerModes.TUNER -> calculateTunerMedals(timeOnCurrentLongNote)
      }

      //textElement.innerHTML = "$longTermNoteName<br/>$timeOnCurrentLongNote<br/>Diff: $currentDiffRounded<br/>Absolute note: $noteName"
      //textElement.innerHTML = "$noteName : $correlatedFrequency<br/>Diff: $currentDiff<br/>Time on current note: $timeOnCurrentNoteInMs"

    }

  fun calculateTunerMedals(timeOnCurrentLongNote : Double) {
    //TODO: figure out how to make sure we were in tune the whole time
  }

  fun calculateStopwatchMedals(timeOnCurrentLongNote : Double) {
    if (timeOnCurrentLongNote > 7) {
      console.log("Gold")
      return
    }
    if (timeOnCurrentLongNote > 5) {
      console.log("Silver")
      return
    }
    if (timeOnCurrentLongNote > 3) {
      console.log("Bronze")
      return
    }
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
