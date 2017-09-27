package com.practicingmusician

import com.practicingmusician.notes.Note

/**
 * Created by jn on 6/6/17.
 */

object UserSettings {
    var transposition = 0 //-2 would be Bb transposition
    var tempo = -1.0 //-1 if we don't want to change the value
      private set
    var isDefaultTempo = true
      private set
    var metronomeAudioOn = true

    var pitch = 440.0

    fun setTempo(bpm : Double, isDefault: Boolean) {
      tempo = bpm
      isDefaultTempo = isDefault
    }
}
