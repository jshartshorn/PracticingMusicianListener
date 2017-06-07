package com.practicingmusician.notes

import com.practicingmusician.AppSettings
import kotlin.js.Math.pow

/**
 * Created by jn on 6/6/17.
 */
class Note(value : Int, dur : Double) {

    val noteNumber = value
    val duration = dur

    fun getFrequency() : Double {
        val A440_NoteNumber: Double = 69.0
        val equalTemperamentPitch = AppSettings.pitch * pow(2.0, (noteNumber.toDouble() - A440_NoteNumber) / 12.0)
        return equalTemperamentPitch
    }

    //fake this for now
    companion object {
        fun getNoteNumber(frequency : Double) : Int {
            when(frequency) {
                440.0 -> return 69
                880.0 -> return 81
            }
            return -1
        }
    }
}