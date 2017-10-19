package com.practicingmusician.steppable

import com.practicingmusician.ListenerApp
import com.practicingmusician.UserSettings
import com.practicingmusician.pm_log
import org.w3c.dom.HTMLElement
import kotlin.browser.document
import kotlin.browser.window

external var listenerApp : ListenerApp

/**
 * Created by jn on 6/5/17.
 */
class Metronome : TimeKeeperSteppable {

    //this is the key that we use to store the sound in the AudioManager
    val downbeatAudioKey = "downbeatSound"
    val beatAudioKey = "beatSound"

    lateinit var audioManager : com.practicingmusician.audio.AudioManager

    //current state of the Metronome
    override var state = TimeKeeper.TimeKeeperState.Stopped

    var timeSignature = 4

    //length of the preroll
    var prerollBeats = 4.0

    //the current beat the metronome is on
    var currentBeat : Int = 0

    //the timestamps that the beats occured at
    val beatTimes = mutableListOf<Double>()

    // Timestamp of the last beat that happened
    var lastBeatOccuredAt = -1.0

    //keys for setTimeout so that we can cancel them later
    val timeoutKeys = mutableListOf<Int>()

    fun setup() {
        //load the audio file
        audioManager.loadAudioFile(listenerApp.parameters.url + listenerApp.parameters.audioAssetPath + "Cowbell.wav",downbeatAudioKey)
        audioManager.loadAudioFile(listenerApp.parameters.url + listenerApp.parameters.audioAssetPath + "Woodblock.wav",beatAudioKey)
    }

    override fun start() {
        state = TimeKeeper.TimeKeeperState.Running
    }

    override fun stop() {
        state = TimeKeeper.TimeKeeperState.Stopped
    }

    override fun setInitialOffset(offset: Double) {
      val beatSize = 1000.0 * 60.0 / listenerApp.getTempo()

      lastBeatOccuredAt = offset - beatSize

    }

    override fun step(timestamp: Double, timeKeeper: TimeKeeper) {
        //calculate the size of a beat in ms, based on the tempo
        val beatSize = 1000.0 * 60.0 / listenerApp.getTempo()

        //this keeps it from playing an extra beat at the end that actually doesn't exist during the exercise
        if (timeKeeper.runForTime - timestamp < beatSize / 2) {
            pm_log("Less than beat size..")
            return
        }

        //if this is the first run, make sure that the first beat will happen at 0, which should be the current timestamp
        if (lastBeatOccuredAt == -1.0) {
            //this is the first run
            lastBeatOccuredAt = timestamp - beatSize
        }

        //the next beat will occur at the time of the last beat, plus the size of the beat
        val nextBeatTime = lastBeatOccuredAt + beatSize


        //update the indicator UI based on the current timestamp
        val absoluteBeatPosition = timestamp / beatSize
        updateIndicatorUI(absoluteBeatPosition)

        //if the timestamp is at the time we are supposed to have the next beat
        //(or passed it -- hopefully this will be impossible by any more than about 16ms)
        //then play the metronome sound, set the lastBeatOccuredAt, update the metronome UI and increment the current beat counter
        if (timestamp >= nextBeatTime) {
            //TODO: wind to the specific time?
          if (UserSettings.metronomeAudioOn) {
            if (currentBeat % timeSignature == 0) {
              audioManager.playAudioNow(downbeatAudioKey)

            } else {
              audioManager.playAudioNow(beatAudioKey)

            }
          }

            lastBeatOccuredAt = nextBeatTime

            updateMetronomeUI(currentBeat)

            currentBeat++
        }


    }

    //make sure the metronome doesn't move once it is turned off
    fun cancelAllUIUpdates() {
        timeoutKeys.reversed().forEach {
            pm_log("Cancelling item... $it")
            window.clearTimeout(it)
        }
        timeoutKeys.removeAll { true }
    }

    fun updateIndicatorUI(beat : Double) {
        listenerApp.moveToPosition(beat - prerollBeats)
    }

    fun updateMetronomeUI(beat : Int) {
        listenerApp.highlightMetronomeItem(beat % timeSignature)
    }

}
