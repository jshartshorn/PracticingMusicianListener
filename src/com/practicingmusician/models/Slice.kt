package com.practicingmusician.models

/**
 * Created by jn on 6/6/17.
 */
class Slice(freq : Double) {

    val frequency : Double = freq
    val markers : MutableList<MarkerType>? = null

    enum class MarkerType {
        NoteChange,BeatChange
    }

}