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

    this.scorePositionCurrentLine = 0
    this.measureCounter = 0

    //gets set later with the current exercise (from notesFromKotlinNotationItems())
    this.exercise = null

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
    this.barHeight = 160
    this.firstBarAddition = 40
    this.scoreWidth = 0

    //counter so that we can get an individual ID for each note
    this.noteIDNumber = 0

    //array of systems (really measures...) that have been added to the screen
    //useful for getting placement information later
    this.systems = Array()

    this.sliderMin = 40
    this.sliderMax = 220
    this.sliderIncrement = 20


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


        //calculate the width
        var totalLines = this.exercise.systems.length
        var totalWidthWillBe = availableWidthAfterMargin

        if (totalLines <= 1) {
            //TODO: Fix this
            //totalWidthWillBe = this.exercise.systems[0].bars.length * this.barWidth + this.firstBarAddition
        }

        this.scoreWidth = totalWidthWillBe

        this.scorePositionInitialX = (actualWindowWidth / 2) - (totalWidthWillBe / 2)

        pm_log("Total width will be " + totalWidthWillBe,10)
        pm_log("Total height will be " + totalLines * this.barHeight)

        var indicatorCanvas = document.getElementById(indicatorCanvasName)

        pm_log("Setting up indicator canvas",10)
        pm_log(indicatorCanvas,10)

        indicatorCanvas.width = actualWindowWidth * this.contentScaleFactor
        indicatorCanvas.height = totalLines * this.barHeight * this.contentScaleFactor

        this.vf = new Vex.Flow.Factory({
                renderer: {
                  selector: elementID,
                  width: actualWindowWidth * this.contentScaleFactor,
                  height: totalLines * this.barHeight * this.contentScaleFactor,
                  backend: VF.Renderer.Backends.SVG
                  }
                });

        this.vf.context.scale(this.contentScaleFactor,this.contentScaleFactor)

        this.registry = new VF.Registry();
        VF.Registry.enableDefaultRegistry(this.registry);

        this.score = this.vf.EasyScore({ throwOnError: true });

        this.voice = this.score.voice.bind(this.score);
        this.notes = this.score.notes.bind(this.score);
        this.beam = this.score.beam.bind(this.score);
    }

    this.changePlayButton = function(className) {
      var button = document.getElementById("playPauseButton")
      if (button != null)
        button.className = className
    }

<<<<<<< HEAD
=======
    this.displayMedal = function(medalClass) {
      var medalIndicator = document.getElementById('medalIndicator')
      if (medalIndicator != null) {
        medalIndicator.className = medalClass
      }
    }

>>>>>>> feature/implementing-design
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
        if (this.exercise.author != undefined && this.exercise.author.length > 0) {
          authorElement.innerHTML = "By: " + this.exercise.author
        }
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

        //remove the old logo, if it exists
        var logoContainer = document.getElementById("notationPmLogo")
        if (logoContainer != null) {
          logoContainer.parentNode.removeChild(logoContainer)
        }

        //new one
        logoContainer = document.createElement("div")
        logoContainer.id = "notationPmLogo"

        notationBody.appendChild(logoContainer)
    }

    this.updateSettingsViaNetwork = function(settingsObj) {
      var settingsUrl = listenerApp.parameters.url + "settings"
      console.log("Sending settings to: " + settingsUrl)
      console.log(settingsObj)
      networkRequest(settingsUrl, settingsObj)
    }

    this.setupControls = function(controlsContainerName) {
        console.log("Setting on controls")

        var container = document.getElementById(controlsContainerName)

        var metronomeSlider = document.getElementById('metronomeSlider')
        if (metronomeSlider != null) {
          metronomeSlider.type = 'range'
          metronomeSlider.min = this.sliderMin
          metronomeSlider.max = this.sliderMax
          metronomeSlider.value = listenerApp.getTempo()

          var updateSettingsViaNetwork = this.updateSettingsViaNetwork

          metronomeSlider.oninput = function(event) {
            console.log("Change")
            console.log(event)
            console.log(event.target.value)
            listenerApp.alterPreferences({
              bpm: event.target.value
            })
            //TODO: store this data with the server
            //updateSettingsViaNetwork()
          }
        }


        var sliderNumbersContainer = document.getElementById('sliderNumbers')

        if (sliderNumbersContainer != null) {
          while (sliderNumbersContainer.firstChild) {
            sliderNumbersContainer.removeChild(sliderNumbersContainer.firstChild);
          }
          for (var i = this.sliderMin; i <= this.sliderMax; i += this.sliderIncrement) {
            var sliderNumberSpan = document.createElement('span')
            sliderNumberSpan.className = 'sliderNumber'
            sliderNumberSpan.id = 'sliderNumber' + i
            sliderNumberSpan.innerHTML = "" + i
            sliderNumbersContainer.appendChild(sliderNumberSpan)
          }
        }

        var metronomeAudioButton = document.getElementById('metronomeAudioButton')
        if (metronomeAudioButton != null) {
          metronomeAudioButton.checked = listenerApp.getMetronomeAudio()

          metronomeAudioButton.onchange = function(event) {
            console.log("Change")
            console.log(event.target.checked)
            listenerApp.alterPreferences({
              metronomeSound: event.target.checked
            })

            updateSettingsViaNetwork({metronome_audio_on: event.target.checked})
          }
        }
    }

    this.setupMetronome = function(metronomeContainerName) {
        //remove the old ones
        var myNode = document.getElementById(metronomeContainerName)
        while (myNode != null && myNode.firstChild) {
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

        if (metronomeContainer != null) {
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

          var tempoMarkingObj = document.getElementById("tempoMarking")
          tempoMarkingObj.value = listenerApp.getTempo()

          var tempo = listenerApp.getTempo()

          //highlight the correct number by the slider
          var closest = Math.ceil(tempo / this.sliderIncrement) * this.sliderIncrement;
          if (closest < this.sliderMin) {
            closest = this.sliderMin
          }
          if (closest > this.sliderMax) {
            closest = this.sliderMax
          }
          console.log("closest: " + closest)
          Array.from(document.getElementsByClassName('sliderNumber')).forEach(function(el) {
            el.className = "sliderNumber"
          })
          var sliderNumberSpan = document.getElementById('sliderNumber' + closest)
          if (sliderNumberSpan != null)
            sliderNumberSpan.className += " highlighted"
        }
    }

    //make a new system (measure) of a given width
    this.makeSystem = function(options) {

        if (options == undefined) options = {}

        var width = this.scoreWidth / options.barsInSystem

        if (options.positionInLine == 0) {
            width += this.firstBarAddition

            if (options.pickup_bar == true) {
              //TODO: dimensions for pickup bar
              //width /= 1.5
            }

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
        //pm_log("Creating at x " + this.scorePositionX,10)
        //pm_log("Creating at y " + this.scorePositionY,10)

        var system = this.vf.System({ x: this.scorePositionX, y: this.scorePositionY, width: width, spaceBetweenStaves: 10 });

        this.measureCounter += 1
        this.scorePositionX += width;

        return system;
    }

    //helper function to get easy access to notes later on
    this.id = function (id) { return this.registry.getElementById(id); }

    //Take the current exercise (as generated by generateExerciseEasyScoreCode) and notate it on the screen,
    this.notateExercise =function() {

        this.score.set({time: this.exercise.time_signature})

        var totalBars = this.exercise.systems.reduce(function(total, cur) { return total + cur.bars.length },0)

        //pm_log("Total bars: " + totalBars,10)

        var barCounter = 0

        console.log("Exercise:")
        console.log(this.exercise)

        var currentClef = 'treble'

        for (lineIndex in this.exercise.systems) {
          var curLine = this.exercise.systems[lineIndex]

            for (barIndex in curLine.bars) {
              //pm_log("Notating bar " + barIndex,10)
              var curBar = curLine.bars[barIndex]

              if (curBar.extra_attributes != undefined && curBar.extra_attributes.clef != undefined) {
                currentClef = curBar.extra_attributes.clef
              }

              var barTime = this.exercise.time_signature

              if (curBar.extra_attributes != undefined && curBar.extra_attributes.alternate_timeSignature != undefined) {
                barTime = curBar.extra_attributes.alternate_timeSignature
              }

              var barOptions = { barsInSystem: curLine.bars.length, positionInLine: barIndex }

              if (curBar.extra_attributes != undefined && curBar.extra_attributes.pickup_bar != undefined) {
                if (curBar.extra_attributes.pickup_bar == true) {
                  barOptions["pickup_bar"] = true
                }
              }

              var system = this.makeSystem(barOptions)

              this.systems.push(system)

              var notesArray = Array()
              //add all the notes

              console.log("Groups:")
              console.log(curBar.groups)

              for (groupIndex in curBar.groups) {
                  var curGroup = curBar.groups[groupIndex]

                  var notesString = ""

                  //take the notes and make a string that EasyScore can read, while giving each note a unique ID

                  //console.log("Cur group:")
                  //console.log(curGroup)
                  var brokenUpNotes = curGroup.notes//[0].split(",")

                  for (var noteIndex in brokenUpNotes) {
                      var note = brokenUpNotes[noteIndex]

                      if (note.note == undefined) {
                        note = {
                          note: note,
                          id: "note" + this.noteIDNumber,
                          attributes: []
                        }
                        brokenUpNotes[noteIndex] = note
                      }

                      if (noteIndex > 0) {
                          notesString += ","
                      }
                      notesString += note.note

                      //pm_log("Creating note id " + this.noteIDNumber,10)

                      notesString += "[id=\"" + note.id + "\"]"

                      this.noteIDNumber++
                  }

                  var additionalInfo = {}

                  additionalInfo.clef = currentClef

                  if (curGroup.stem_direction != undefined) {
                      additionalInfo.stem = curGroup.stem_direction
                  }

                  var notes = this.notes(notesString,additionalInfo)

                  //console.log("Notes:")
                  //console.log(notes)

                  brokenUpNotes.forEach(function(noteInfo) {
                    //console.log("Searching for note: " + noteInfo.id)
                    var note = notes.find(function(n) { return n.attrs.id == noteInfo.id})
                    //console.log("Found note:")
                    //console.log(note)
                    noteInfo.attributes.forEach(function(attr) {
                      switch(attr.key) {
                        case "bowing":
                          var symbol = function(bowDirection) {
                            return bowDirection == 'up' ? 'a|' : 'am'
                          }(attr.value)
                          note.addArticulation(0, new VF.Articulation(symbol).setPosition(3));
                          break
                        case "textAnnotation":
                          note.addAnnotation(0, new VF.Annotation(attr.value).setPosition(3));
                          break
                        default:
                          console.warn("Unknown note attribute: ")
                          console.log(attr)
                      }
                    })
                  })


                  //notes[2].addAnnotation(0, new VF.Annotation('L').setPosition(3));

//                  notes[2].addArticulation(0, new VF.Articulation('a|').setPosition(3));
//
//                  var articulationPosition = function(stemDirection) {
//                    if (stemDirection == -1) {
//                      return 4
//                    } else {
//                      return 3
//                    }
//                  }(notes[3].stem_direction)
//                  notes[3].addArticulation(0, new VF.Articulation('am').setPosition(articulationPosition));

                  //check if it's beamed
                  if (curGroup.beam === true) {
                      notes = this.beam(notes)
                  }

                  notesArray.push(
                      notes
                  )

              }


              //create the measure and connect all the groups with the reduce(concat) function
              var stave = system.addStave(
                { voices: [
                    this.voice(notesArray.reduce(concat),{time: barTime})]
                });

              //get the extra_attributes if there are any
              if (curBar.extra_attributes != undefined) {
                  for (attr in curBar.extra_attributes) {
                      var value = curBar.extra_attributes[attr]
                      switch(attr) {
                          case "time_signature":
                              stave.addTimeSignature(value)
                              break
                          case "clef":
                              stave.addClef(value)
                              break
                          case "key_signature":
                              stave.addKeySignature(value)
                              break
                          default:
                              pm_log("Unknown attribute:" + attr,10)
                              break
                      }
                  }
              }

              //if it's the last bar, make the bar line the correct end bar
              if (barCounter == totalBars - 1) {
                  stave.setEndBarType(VF.Barline.type.END)
              }
              barCounter+= 1

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
            for (index in this.exercise.notes) {
                var item = this.exercise.notes[index]

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
        //pm_log("Get position for beat: " + beat,10)
        //get the elements on either side
        var ts = this.getElementsForBeat(beat)

        //pm_log(ts,10)

        //use the ids to get the actual elements
        var currentItem = this.id("note" + ts.currentItemIndex)
        var nextItem = this.id("note" + ts.nextItemIndex)

        //pm_log("Current and next: ",10)
        //pm_log(currentItem,10)
        //pm_log(nextItem,10)

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
        var pos = stave.height + topStaveY + 40
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

    this.createArticulationElement = function() {
      var obj = document.createElement('div')
      obj.className = 'articulationItem'
      obj.innerHTML = "V"

      var x = 100
      var y = 100

      var articulationWidth = 10

      obj.style.position = "absolute"
      obj.style.top = "" + y  * this.contentScaleFactor + "px"
      obj.style.left = "" + x * this.contentScaleFactor - (articulationWidth / 2) + "px"

      document.getElementById(this.containerElementName).appendChild(obj)
    }

    this.createFeedbackHTMLElement = function(feedbackType,feedbackItemsArray,x,y) {
        var feedbackWidth = 16 * this.contentScaleFactor
        var obj = document.createElement('div');
        obj.className = "feedbackItem"

        //console.log("Feedback type:")
        //console.log(feedbackType.name$)

        switch(feedbackType.name$) {
          case "Missed":
            obj.className += " incorrect_note"
            break;
          case "Incorrect":
            obj.className += " off_note"
            break;
          case "Correct":
            obj.className += " correct"
            break;
          default:
            pm_log("Error on type: " + feedbackType.name$,10)
            break;
        }

        var feedbackItems = feedbackItemsArray.map(function(item) {
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
