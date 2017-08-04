package com.practicingmusician.notes

import com.practicingmusician.GeneratedExercise

/**
 * Created by jn on 6/27/17.
 *
 * This isn't getting used right now -- it turned out easier to just deal with the pure JS
 *
 */
class EasyScoreUtil_Kotlin  {

    var scorePositionInitialX = 60
    var scorePositionInitialY = 20

    var scorePositionX = 0
    var scorePositionY = 0
    var positionInLine = 0

    var scorePositionCurrentLine = 0
    var measureCounter = 0

    //gets set later with the current exercise (from notesFromKotlinNotationItems())
    var exercise : dynamic = null
    lateinit var generatedExercise : GeneratedExercise

    //VexFlow variables that need to be stored
    var vf : dynamic = null
    var registry : dynamic = null

    //these three are just bind-ed functions
    var score = null
    var voice = null
    var beam = null

    //formatting info for the notation
    var contentScaleFactor = 1.0
    var useScaling = true
    var assumedCanvasWidth = 1024 //this will never change, although the scaling factor will change this
    var barWidth  = 200
    var barHeight = 160
    var firstBarAddition = 40
    var barsPerLine = 4

    //counter so that we can get an individual ID for each note
    var noteIDNumber = 0

    //array of systems (really measures...) that have been added to the screen
    //useful for getting placement information later
    var systems = mutableListOf<dynamic>()


//    fun setupOnElement(elementID : String) {
//
//    }
//
//    fun notateExercise() {
//
//    }
//
//    fun drawIndicatorLine(canvas : dynamic, beat : Double) {
//
//    }
//
//    fun id(name : String) : dynamic {
//
//    }
//
//    fun getPositionForBeat(beat: Double) : BeatPosition {
//        //get the elements on either side
//        var ts = this.getElementsForBeat(beat)
//
//        //use the ids to get the actual elements
//        var currentItem = this.id("note" + ts.currentItemIndex)
//        var nextItem = this.id("note" + ts.nextItemIndex)
//
//        var staveYPos = currentItem.stave.getYForLine(0)
//        var initialPos = this.middlePositionOfItem(currentItem)
//
//        //find the middles of the items
//        var distance = this.middlePositionOfItem(nextItem) - this.middlePositionOfItem(currentItem)
//
//
//        if (currentItem.stave.getBoundingBox().y != nextItem.stave.getBoundingBox().y) {
//            //the nextItem appears on the next line
//
//            distance = currentItem.stave.end_x - this.middlePositionOfItem(currentItem)
//        }
//
//        return BeatPosition((initialPos + distance * ts.percent),staveYPos)
//
//    }
//
//    fun getFeedbackYPosition(staveTopY : Double) : Double {
//
//    }
//
//    fun createFeedbackHTMLElement(items : Array<String>, x : Double, y : Double) {
//
//    }

}
