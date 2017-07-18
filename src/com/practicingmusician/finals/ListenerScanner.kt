package com.practicingmusician.finals

import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.SampleCollection

/**
 * Created by jn on 7/18/17.
 */
class ListenerScanner {

  fun scanAndCompare(idealNotes: List<Note>, sampleCollections: List<SampleCollection>): CompareResults {

    //Should loop through each note and attempt to find that spot in the sampleCollection list
    //
    //Upon finding it, it should scan backwards and forwards on the sampleCollection to see if the note is happening and
    //if it is forward or backward from the expected position
    //
    //Once finding that position, it should scan forward to see how long the note lasts

    var curPositionInIdeal = 0.0

    val tempo = 120.0

    val beatSizeInSamples = 1000.0 * 60.0 / tempo * 44100.0;

    idealNotes.forEachIndexed { noteIndex, note ->

      //find the expected spot in the sample collection
      var positionInSamples = -1.0
      var indexOfSampleCollectionItem = -1
      var curPositionInSampleCollection = 0.0
      var smallestDistanceSoFar = Double.MAX_VALUE
      //TODO: can avoid this by storing position markers when the SampleCollection objects are created
      sampleCollections.forEachIndexed { sampleIndex, sampleCollection ->
        val curDistance = curPositionInSampleCollection - curPositionInIdeal
        if (curDistance < smallestDistanceSoFar) {
          smallestDistanceSoFar = curDistance
          positionInSamples = curPositionInSampleCollection
          indexOfSampleCollectionItem = sampleIndex
        }
        curPositionInSampleCollection += (sampleCollection.lengthInSamples / beatSizeInSamples)
      }



      curPositionInIdeal += note.duration
    }


    return CompareResults(0,0)
  }

}
