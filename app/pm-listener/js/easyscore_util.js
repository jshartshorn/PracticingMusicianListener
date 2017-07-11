/*
 * This is a helper that should be the interface to most of what the app does with VexFlow,
 * specifically using the EasyScore system
 *
 * Written as a global variable, but it does store some state information, since the notation should
 * only be done once
 */

VF = Vex.Flow;

//helper function
function concat(a, b) { return a.concat(b); }


var indicatorCanvasName = "indicatorCanvas";
var feedbackCanvasName = "feedbackCanvas";


var EasyScoreUtil = function() {

    this.containerElementName = ""

    //the current position that systems are being placed on the screen
    this.scorePositionInitialX = 60
    this.scorePositionInitialY = 20

    this.scorePositionX = 0
    this.scorePositionY = 0
    this.positionInLine = 0

    this.scorePositionCurrentLine = 0
    this.measureCounter = 0

    //gets set later with the current exercise (from notesFromKotlinNotationItems())
    this.exercise = null
    this.generatedExercise = null

    //VexFlow variables that need to be stored
    this.vf = null
    this.registry = null

    //these three are just bind-ed functions
    this.score = null
    this.voice = null
    this.beam = null

    //formatting info for the notation
    this.contentScaleFactor = 1.0
    this.useScaling = true
    this.assumedCanvasWidth = 1024 //this will never change, although the scaling factor will change this
    this.barWidth  = 200
    this.barHeight = 160
    this.firstBarAddition = 40
    this.barsPerLine = 4

    //counter so that we can get an individual ID for each note
    this.noteIDNumber = 0

    //array of systems (really measures...) that have been added to the screen
    //useful for getting placement information later
    this.systems = Array()

    //setup the basic notation stuff
    this.setupOnElement = function(elementID) {
        //calculate the scale
        var actualWindowWidth = document.getElementById(elementID).offsetWidth

        if (this.useScaling) {
            this.contentScaleFactor = actualWindowWidth / this.assumedCanvasWidth

            actualWindowWidth = this.assumedCanvasWidth
        }

        var availableWidthAfterMargin = actualWindowWidth - (this.scorePositionInitialX * 2)

        pm_log("Avail width: " + availableWidthAfterMargin)



        this.barWidth = availableWidthAfterMargin / this.barsPerLine

        pm_log("Bar width: " + this.barWidth)

        //calculate the width
        var totalLines = Math.ceil(this.exercise.bars.length / this.barsPerLine)
        var totalWidthWillBe = this.barsPerLine * this.barWidth + this.firstBarAddition

        if (totalLines <= 1) {
            totalWidthWillBe = this.exercise.bars.length * this.barWidth + this.firstBarAddition
        }

        this.scorePositionInitialX = (actualWindowWidth / 2) - (totalWidthWillBe / 2)

        pm_log("Total width will be " + totalWidthWillBe)
        pm_log("Total height will be " + totalLines * this.barHeight)

        var indicatorCanvas = document.getElementById(indicatorCanvasName)

        pm_log("Setting up indicator canvas",10)
        pm_log(indicatorCanvas,10)

        indicatorCanvas.width = actualWindowWidth * this.contentScaleFactor
        indicatorCanvas.height = totalLines * this.barHeight * this.contentScaleFactor

        this.vf = new Vex.Flow.Factory({
                renderer: {selector: elementID, width: actualWindowWidth * this.contentScaleFactor, height: totalLines * this.barHeight * this.contentScaleFactor}
                });

        this.vf.context.scale(this.contentScaleFactor,this.contentScaleFactor)

        this.registry = new VF.Registry();
        VF.Registry.enableDefaultRegistry(this.registry);

        this.score = this.vf.EasyScore({ throwOnError: true });

        this.voice = this.score.voice.bind(this.score);
        this.notes = this.score.notes.bind(this.score);
        this.beam = this.score.beam.bind(this.score);
    }

    this.buildTitleElements = function(containerName) {
        //remove the old one
        var oldTitleContainer = document.getElementById("titleContainer")
        if (oldTitleContainer != null) {
            oldTitleContainer.parentNode.removeChild(oldTitleContainer)
        }

        var titleContainer = document.createElement("div")
        titleContainer.id = "titleContainer"

        var titleElement = document.createElement("span")
        titleElement.id = "mainTitle"
        titleElement.innerHTML = this.exercise.title
        titleContainer.appendChild(titleElement)

        var authorElement = document.createElement("span")
        authorElement.id = "exerciseAuthor"
        authorElement.innerHTML = "By: " + this.exercise.author
        titleContainer.appendChild(authorElement)

        var notationBody = document.getElementById(containerName)
        notationBody.insertBefore(titleContainer,notationBody.childNodes[0])

        //the bottom info
        var copyrightInfoContainer = document.getElementById("copyrightContainer")
        if (copyrightInfoContainer != null) {
            copyrightInfoContainer.parentNode.removeChild(copyrightInfoContainer)
        }

        //build the new one
        copyrightInfoContainer = document.createElement("div")
        copyrightInfoContainer.id = "copyrightContainer"

        copyrightInfoContainer.innerHTML = this.exercise.copyrightInfo

        notationBody.appendChild(copyrightInfoContainer)
    }

    this.setupMetronome = function(metronomeContainerName) {
        //remove the old ones
        var myNode = document.getElementById(metronomeContainerName)
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }

        console.log("Making metronome for " + this.exercise.time_signature)
        var metronomeItemsToCreate = 1
        switch(this.exercise.time_signature) {
            case "4/4":
                metronomeItemsToCreate = 4
                break
            case "3/4":
                metronomeItemsToCreate = 3
                break
            case "6/8":
                metronomeItemsToCreate = 6
                break
        }

        var metronomeContainer = document.getElementById(metronomeContainerName)
        metronomeContainer.style.display = "flex"
        metronomeContainer.style.flexDirection = "row"
        metronomeContainer.style.justifyContent = "space-around"
        metronomeContainer.style.alignItems = "center"


        var metronomeItemsObj = document.createElement("div")
        metronomeItemsObj.id = "metronomeItems"
        document.getElementById(metronomeContainerName).appendChild(metronomeItemsObj)

        for (var i = 0; i < metronomeItemsToCreate; i++) {
            var metronomeItemObj = document.createElement("span")
            metronomeItemObj.className = "metronomeItem"
            if (i == 0)
                metronomeItemObj.className += " highlighted"
            document.getElementById("metronomeItems").appendChild(metronomeItemObj)
        }

        //setup the tempo marking
        var tempoMarkingObj = document.createElement("span")
        tempoMarkingObj.id = "tempoMarking"
        tempoMarkingObj.innerHTML = this.exercise.tempo + "<br/> bpm"
        metronomeContainer.appendChild(tempoMarkingObj)
    }

    //make a new system (measure) of a given width
    this.makeSystem = function () {

        this.positionInLine = this.measureCounter % this.barsPerLine

        var width = this.barWidth

        if (this.positionInLine == 0) {
            //pm_log("NEW LINE")
            width += this.firstBarAddition
            this.scorePositionX = this.scorePositionInitialX
            if (this.scorePositionY == 0) {
                this.scorePositionY = this.scorePositionInitialY
            } else {
                this.scorePositionY += this.barHeight
            }
        } else {
            //pm_log("SAME LINE")
        }
//
//        pm_log("Creating at x " + this.scorePositionX)
//        pm_log("Creating at y " + this.scorePositionY)

        var system = this.vf.System({ x: this.scorePositionX, y: this.scorePositionY, width: width, spaceBetweenStaves: 10 });

        this.measureCounter += 1
        this.scorePositionX += width;

        return system;
    }

    //helper function to get easy access to notes later on
    this.id = function (id) { return this.registry.getElementById(id); }

    //Take the current exercise (as generated by generateExerciseEasyScoreCode) and notate it on the screen,
    this.notateExercise =function() {
        for (barIndex in this.exercise.bars) {
            var curBar = this.exercise.bars[barIndex]

            var system = this.makeSystem()

            this.systems.push(system)

            var notesArray = Array()
            //add all the notes
            for (groupIndex in curBar.groups) {
                var curGroup = curBar.groups[groupIndex]

                var notesString = ""

                //take the notes and make a string that EasyScore can read, while giving each note a unique ID
                for (var noteIndex in curGroup.notes) {
                    var note = curGroup.notes[noteIndex]

                    if (noteIndex > 0) {
                        notesString += ","
                    }
                    notesString += note

                    notesString += "[id=\"note" + this.noteIDNumber + "\"]"

                    this.noteIDNumber++
                }

                var additionalInfo = {}

                if (curGroup.stem_direction != undefined) {
                    additionalInfo.stem = curGroup.stem_direction
                }

                var notes = this.notes(notesString,additionalInfo)

                //check if it's beamed
                if (curGroup.beam === true) {
                    notes = this.beam(notes)
                }

                notesArray.push(
                    notes
                )

            }

            //create the measure and connect all the groups with the reduce(concat) function
            var stave = system.addStave({ voices: [this.voice(
                            notesArray.reduce(concat)
                            )] });

            //get the extra_attributes if there are any
            if (curBar.extra_attributes != undefined) {
                for (attributeIndex in curBar.extra_attributes) {
                    var attr = curBar.extra_attributes[attributeIndex]
                    switch(attr.name) {
                        case "time_signature":
                            stave.addTimeSignature(attr.value)
                            break
                        case "clef":
                            stave.addClef(attr.value)
                            break
                        case "key_signature":
                            stave.addKeySignature(attr.value)
                            break
                        default:
                            pm_log("Unknown attribute",10)
                            break
                    }
                }
            }

            //if it's the last bar, make the bar line the correct end bar
            if (barIndex == this.exercise.bars.length - 1) {
                stave.setEndBarType(VF.Barline.type.END)
            }
        }

        //draw it to the screen
        this.vf.draw();
        VF.Registry.disableDefaultRegistry();
    }

    //given a certain beat, return the elements (notes) that surround it.
    //So, in a bar of quarter notes, 1.5 should return the first and second items, with
    //percent at 0.5
    this.getElementsForBeat = function(beat) {

            //current position to scan
            var currentPosition = 0

            //these will be the elements we store and return
            var beginningItemIndex = null
            var endingItemIndex = null

            //the beat positions of those elements
            var firstItemBeatPosition = 0
            var lastItemBeatPosition = 0

            //percentage between the elements that the beat exists in
            var percent = null

            //pm_log("Searching for beat " + beat + " in",10)
            //pm_log(this.generatedExercise.notes,10)

            //this pulls from generatedExercise, which is the non-EasyScore set of notes and durations
            for (index in this.generatedExercise.notes) {
                var item = this.generatedExercise.notes[index]

                var duration = item.duration

                if (currentPosition <= beat) {
                    beginningItemIndex = index
                    endingItemIndex = index

                    firstItemBeatPosition = currentPosition
                    lastNoteBeatPosition = currentPosition
                } else {
                    if (beginningItemIndex == null) {
                        beginningItemIndex = index
                        firstItemBeatPosition = currentPosition
                    }
                    //set the end item index
                    endingItemIndex = index
                    lastItemBeatPosition = currentPosition

                    if (currentPosition >= beat) {
                        break
                    }
                }

                currentPosition += duration

            }

            var distanceBetween = lastItemBeatPosition - firstItemBeatPosition
            var beatDistanceFromFirstItem = beat - firstItemBeatPosition

            percent = beatDistanceFromFirstItem / distanceBetween

            if (percent < 0 || isNaN(percent)) percent = 0

            //pm_log("End pos: " + currentPosition)
            return {
                "currentItemIndex": beginningItemIndex, //item at or before the beat
                "nextItemIndex": endingItemIndex, //item after the beat
                "percent" : percent //percent that describes the distance
            }
     }

    //get the position (coordinates) for a certain beat
    this.getPositionForBeat = function(beat) {
        //get the elements on either side
        var ts = this.getElementsForBeat(beat)

        //use the ids to get the actual elements
        var currentItem = this.id("note" + ts.currentItemIndex)
        var nextItem = this.id("note" + ts.nextItemIndex)

        var staveYPos = currentItem.stave.getYForLine(0)
        var initialPos = this.middlePositionOfItem(currentItem)

        //find the middles of the items
        var distance = this.middlePositionOfItem(nextItem) - this.middlePositionOfItem(currentItem)


        if (currentItem.stave.getBoundingBox().y != nextItem.stave.getBoundingBox().y) {
            //the nextItem appears on the next line

            distance = currentItem.stave.end_x - this.middlePositionOfItem(currentItem)
        }

        return {
                x: (initialPos + distance * ts.percent),
                y: staveYPos
            }


      }

    //helper function to find the middle of an item
     this.middlePositionOfItem = function(item) {
              return item.getAbsoluteX() + item.getBoundingBox().w / 2.0
      }

    //get a basic representation of the stave, for things like height
    this.getBasicStave = function() {
        return this.systems[0].parts[0].stave
    }

    this.getStaveForBeat = function(beat) {
        var ts = this.getElementsForBeat(beat)
        var currentItem = this.id("note" + ts.currentItemIndex)
        var stave = currentItem.stave
        return stave
    }

    //draw the indicator line (blue line that shows current position)
    this.drawIndicatorLine = function(canvas, beat) {

            var indicatorPosition = this.getPositionForBeat(beat)

            var indicatorOverflow = 20 * this.contentScaleFactor

            var stave = this.getBasicStave()
            var staveHeight = stave.getYForLine(4) - stave.getYForLine(0)

            var topY = indicatorPosition.y - indicatorOverflow
            var bottomY = indicatorPosition.y + staveHeight + indicatorOverflow

            if (canvas.getContext) {

            	   // use getContext to use the canvas for drawing
            	   var ctx = canvas.getContext('2d');

                   ctx.strokeStyle = '#4990E2';
                   ctx.lineWidth = 3;

            	   // Stroked path
            	   ctx.beginPath();
            	   ctx.moveTo(indicatorPosition.x * this.contentScaleFactor,bottomY * this.contentScaleFactor);
            	   ctx.lineTo(indicatorPosition.x * this.contentScaleFactor,topY * this.contentScaleFactor);
            	   ctx.closePath();
            	   ctx.stroke();

              }
        }

    //get the Y coordinate for feedback items
    this.getFeedbackYPosition = function(topStaveY) {
        var stave = this.getBasicStave()
        var pos = stave.height + topStaveY + 20
        return pos
    }

    //draw feedback item at a given position
    this.drawFeedbackAtPosition = function(canvas,feedbackItemType,x,y) {

            var ctx = canvas.getContext('2d');

            ctx.font = "16px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "top";
            ctx.fillText(feedbackItemType,x * this.contentScaleFactor,y * this.contentScaleFactor)

            //to test location
//            ctx.strokeStyle = '#4990E2';
//                               ctx.lineWidth = 3;
//
//                        	   // Stroked triangle
//                        	   ctx.beginPath();
//                        	   ctx.moveTo(x,y);
//                        	   ctx.lineTo(x + 2,y);
//                        	   ctx.closePath();
//                        	   ctx.stroke();
    }

    this.createFeedbackHTMLElement = function(feedbackItemType,x,y) {
        var feedbackWidth = 16 * this.contentScaleFactor
        var obj = document.createElement('div');
        obj.className = "feedbackItem off_note"

        var feedbackItems = feedbackItemType.map(function(item) {
            var itemObj = document.createElement('span')
            itemObj.className = "feedbackItemElement"

            var keyObj = document.createElement("span")
            keyObj.className = "feedbackKey"
            keyObj.innerHTML = item.name

            var valueObj = document.createElement("span")
            valueObj.className = "feedbackValue"
            valueObj.innerHTML = item.value

            itemObj.appendChild(keyObj)
            itemObj.appendChild(valueObj)

            return itemObj
        })

        var feedbackContainerObj = document.createElement("div")
        feedbackContainerObj.className = "feedbackItemContainer"

        feedbackItems.forEach(function(item) {
            feedbackContainerObj.appendChild(item)
        })

        obj.appendChild(feedbackContainerObj)

        obj.style.position = "absolute"
        obj.style.top = "" + y  * this.contentScaleFactor + "px"
        obj.style.left = "" + x * this.contentScaleFactor - (feedbackWidth / 2) + "px"

        document.getElementById(this.containerElementName).appendChild(obj)
    }

}