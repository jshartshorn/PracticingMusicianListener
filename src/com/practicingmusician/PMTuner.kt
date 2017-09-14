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

  //current state of the Metronome
  override var state = TimeKeeper.TimeKeeperState.Stopped

  lateinit var textElement : HTMLElement
  lateinit var audioAnalyzer : AudioAnalyzer

  val timekeeper = TimeKeeper()

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

      if (correlatedFrequency == undefined) return

      val noteWithDiff = Note.closestNoteWithDiff(correlatedFrequency)

      val noteName = noteWithDiff.note.noteName()

      val diff = noteWithDiff.difference

      textElement.innerHTML = "$noteName : $correlatedFrequency<br/>Diff: $diff"

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
