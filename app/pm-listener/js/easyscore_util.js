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

    this.currentVisiblePageNumber = 0

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

    //formatting info for the notation
    this.contentScaleFactor = 1.0
    this.useScaling = true
    this.assumedCanvasWidth = 1124 //this will never change, although the scaling factor will change this
    this.barHeight = 160
    this.firstBarAddition = 100

    this.numberOfSystemsPerPage = 4
    this.numberOfPages = -1 //will get set later

    this.scoreWidth = 0

    this.scores = []
    this.vfs = []

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

        this.registry = new VF.Registry();
        VF.Registry.enableDefaultRegistry(this.registry);


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

        this.scoreWidth = totalWidthWillBe

        this.scorePositionInitialX = (actualWindowWidth / 2) - (totalWidthWillBe / 2)

        this.numberOfPages = Math.ceil(totalLines / this.numberOfSystemsPerPage)

        var pageWidth = actualWindowWidth * this.contentScaleFactor
        var pageHeight = this.numberOfSystemsPerPage * this.barHeight * this.contentScaleFactor

        //if we have fewer than a full page of systems, set it to smaller
        if (totalLines < this.numberOfSystemsPerPage) {
          pageHeight = totalLines * this.barHeight * this.contentScaleFactor
        }

        pm_log("Total width will be " + totalWidthWillBe,10)
        pm_log("Total height will be " + totalLines * this.barHeight)

        var indicatorCanvas = document.getElementById(indicatorCanvasName)

        pm_log("Setting up indicator canvas",10)
        pm_log(indicatorCanvas,10)

        indicatorCanvas.width = pageWidth
        indicatorCanvas.height = pageHeight



        for (var i = 0; i < this.numberOfPages; i++) {
          var page = document.createElement('div')
          page.className = "notationPage"
          page.id = "notationPage_" + "page" + i
          document.getElementById(elementID).appendChild(page)

          var curVf = new Vex.Flow.Factory({
                renderer: {
                  elementId: page.id,
                  width: pageWidth,
                  height: pageHeight,
                  backend: VF.Renderer.Backends.SVG
                  }
                });

          curVf.context.scale(this.contentScaleFactor,this.contentScaleFactor)

          this.vfs.push(curVf)

          this.scores.push ( curVf.EasyScore({ throwOnError: true }) );
        }

        //set up the pagination controls
        this.buildPaginationControls(elementID)
    }

    this.buildPaginationControls = function(elementID) {
      if (this.numberOfPages <= 1) { return }

      var paginationControls = document.createElement('div')
      paginationControls.id = 'notationPaginationControls'

      var previousPageLink = document.createElement('span')
      previousPageLink.className = "paginationLink"
      previousPageLink.id = 'paginationPreviousPage'
      previousPageLink.innerHTML = ""
      paginationControls.appendChild(previousPageLink)

      var pageText = document.createElement('span')
      pageText.id = 'paginationLabel'
      pageText.innerHTML = "page"
      paginationControls.appendChild(pageText)

      var nextPageLink = document.createElement('span')
      nextPageLink.className = "paginationLink"
      nextPageLink.id = 'paginationNextPage'
      nextPageLink.innerHTML = ""
      paginationControls.appendChild(nextPageLink)

      var notationBody = document.getElementById(elementID)
      notationBody.appendChild(paginationControls)

      this.setPaginationControlsState()
    }

    this.setPaginationControlsState = function() {
      var pageText = document.getElementById('paginationLabel')
      pageText.innerHTML = "page " + (this.currentVisiblePageNumber + 1) + " / " + this.numberOfPages

      var showPage = this.showPageNumber.bind(this)
      var currentVisiblePageNumber = this.currentVisiblePageNumber

      var previousPageLink = document.getElementById('paginationPreviousPage')
      if (currentVisiblePageNumber > 0) {
        previousPageLink.onclick = function() {
          showPage(currentVisiblePageNumber - 1)
        }
        previousPageLink.className = "paginationLink pageBackward"
      } else {
        previousPageLink.onclick = null
        previousPageLink.className = "paginationLink pageBackward disabled"
      }


      var nextPageLink = document.getElementById('paginationNextPage')
      if (currentVisiblePageNumber < this.numberOfPages - 1) {
        nextPageLink.onclick = function() {
          showPage(currentVisiblePageNumber + 1)
        }
        nextPageLink.className = "paginationLink pageForward"
      } else {
        nextPageLink.onclick = null
        nextPageLink.className = "paginationLink pageForeward disabled"
      }
    }

    this.changePlayButton = function(className) {
      var button = document.getElementById("playPauseButton")
      if (button != null) {
        var currentClass = button.className

        if (currentClass == 'playing' && className == 'stopped')
          className = 'restart'

        button.className = className
      }
    }

    this.displayMedal = function(medalClass) {
      var medalIndicator = document.getElementById('medalIndicator')
      if (medalIndicator != null) {
        medalIndicator.className = medalClass
      }
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
          for (var i = this.sliderMin; i < this.sliderMax; i += this.sliderIncrement) {
            var sliderNumberSpan = document.createElement('span')
            sliderNumberSpan.className = 'sliderNumber'
            sliderNumberSpan.id = 'sliderNumber' + i
            sliderNumberSpan.innerHTML = "" + i
            sliderNumbersContainer.appendChild(sliderNumberSpan)

            var sliderNumberSeparator = document.createElement('span')
            sliderNumberSeparator.className = 'sliderNumberSeparator'
            sliderNumbersContainer.appendChild(sliderNumberSeparator)
          }
        }

        var metronomeAudioButton = document.getElementById('metronomeAudioButton')
        if (metronomeAudioButton != null) {
          var audioOn = listenerApp.getMetronomeAudio()

          metronomeAudioButton.className = audioOn ? "checked" : ""

          metronomeAudioButton.onclick = function() {
            var newPref = !listenerApp.getMetronomeAudio()

            if (newPref == true) {
              listenerApp.parameters.displaySiteDialog(
                {
                  imageType: "medal-fail-icon",
                  title: "Audio Alert",
                  message: "To reduce microphone interference, use headphones.",
                }
              )
            }

            listenerApp.alterPreferences({
              metronomeSound: newPref
            })

            metronomeAudioButton.className = newPref ? "checked" : ""

            updateSettingsViaNetwork({metronome_audio_on: newPref})
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

          tempoMarkingObj.onchange = function(val) {
            //TODO: validation
            var bpm = Number(val.target.value)
            if (isNaN(bpm) || ((bpm < 40 || bpm > 220) )) {
              alert("Invalid tempo")
              val.target.value = listenerApp.getTempo()
              return
            }
            listenerApp.alterPreferences({bpm: bpm})
            var metronomeSlider = document.getElementById('metronomeSlider')
            metronomeSlider.value = bpm

          }
        }
    }

    //make a new system (measure) of a given width
    this.makeSystem = function(options,vf) {

        if (options == undefined) options = {}

        var width = (this.scoreWidth / options.barsInSystem) - (this.firstBarAddition / options.barsInSystem)

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

        var system = vf.System({ x: this.scorePositionX, y: this.scorePositionY, width: width, spaceBetweenStaves: 10 });

        this.measureCounter += 1
        this.scorePositionX += width;

        return system;
    }

    //helper function to get easy access to notes later on
    this.id = function (id) { return this.registry.getElementById(id); }

    //Take the current exercise (as generated by generateExerciseEasyScoreCode) and notate it on the screen,
    this.notateExercise = function() {

        var totalBars = this.exercise.systems.reduce(function(total, cur) { return total + cur.bars.length },0)

        //pm_log("Total bars: " + totalBars,10)

        var barCounter = 0

        var currentClef = 'treble'

        for (lineIndex in this.exercise.systems) {

          var curPageNumber = Math.floor(lineIndex / this.numberOfSystemsPerPage)

          //is it the beginning of a new page
          var isNewPage = (curPageNumber == lineIndex / this.numberOfSystemsPerPage)

          if (isNewPage) {
            this.scorePositionY = 0
          }

          console.log("Page: " + curPageNumber)

          var curVf = this.vfs[curPageNumber]

          var curScore = this.scores[curPageNumber]

          curScore.set({time: this.exercise.time_signature})

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

              var system = this.makeSystem(barOptions,curVf)

              this.systems.push(system)

              var notesArray = Array()
              //add all the notes

              //console.log("Groups:")
              //console.log(curBar.groups)

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

                      //find the note
                      var otherNote = this.exercise.notes.find(function(n) { return n.noteId == note.id })
                      if (otherNote != null) {
                        //console.log("Assigning page " + curPageNumber + " to note " + note.id)
                        otherNote.page = curPageNumber
                      }

                      this.noteIDNumber++
                  }

                  var additionalInfo = {}

                  additionalInfo.clef = currentClef

                  if (curGroup.stem_direction != undefined) {
                      additionalInfo.stem = curGroup.stem_direction
                  }

                  var notes = curScore.notes(notesString,additionalInfo)

                  //console.log("Notes:")
                  //console.log(notes)

                  //center the whole rests
                  brokenUpNotes.forEach(function(noteInfo) {
                    var note = notes.find(function(n) { return n.attrs.id == noteInfo.id})
                    if (note.duration == 'w' && note.noteType == 'r') {
                      note.align_center = true
                      note.x_shift = 0
                    }
                  })

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

                  //check if it's beamed
                  if (curGroup.beam === true) {
                      notes = curScore.beam(notes)
                  }

                  notesArray.push(
                      notes
                  )

              }


              //create the measure and connect all the groups with the reduce(concat) function
              var stave = system.addStave(
                { voices: [
                    curScore.voice(notesArray.reduce(concat),{time: barTime})]
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
                          case "barlines":
                              if (value.length == 0) break
                              value.forEach(function(barline) {
                                switch(barline.repeatType) {
                                case "begin":
                                  stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
                                  break
                                case "end":
                                  stave.setEndBarType(VF.Barline.type.REPEAT_END)
                                  break
                                default:
                                  pm_log("Unknown attribute:" + attr,10)
                                }
                              })

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

          curVf.draw();

        }

        //draw it to the screen
        VF.Registry.disableDefaultRegistry();

        //show the first page
        this.showPageNumber(0)
    }

    this.showPageNumber = function(pageNum) {
      this.currentVisiblePageNumber = pageNum
      var allPages = document.getElementsByClassName("notationPage")
      Array.from(allPages).forEach(function(el) {
            el.className = "notationPage"
            el.style.display = "none"
      })

      var pageToShow = document.getElementById("notationPage_" + "page" + pageNum)
      pageToShow.className += " pageVisible"
      pageToShow.style.display = "block"

      this.setPaginationControlsState()
    }

    //given a certain beat, return the elements (notes) that surround it.
    //So, in a bar of quarter notes, 1.5 should return the first and second items, with
    //percent at 0.5
    this.getElementsForBeat = function(beat) {

            //current position to scan
            var currentPosition = 0

            //these will be the elements we store and return
            var beginningItem = null
            var endingItem = null

            //the beat positions of those elements
            var firstItemBeatPosition = 0
            var lastItemBeatPosition = 0

            //percentage between the elements that the beat exists in
            var percent = null

            //pm_log("Searching for beat " + beat + " in",10)
            //pm_log(this.exercise.notes,10)

            //this pulls from generatedExercise, which is the non-EasyScore set of notes and durations
            for (index in this.exercise.notes) {
                var item = this.exercise.notes[index]

                var duration = item.duration

                if (currentPosition <= beat) {
                    beginningItem = item
                    endingItem = item

                    firstItemBeatPosition = currentPosition
                    lastNoteBeatPosition = currentPosition
                } else {
                    if (beginningItem == null) {
                        beginningItem = item
                        firstItemBeatPosition = currentPosition
                    }
                    //set the end item index
                    endingItem = item
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

            //console.log("Current page: " + currentItemPage + " Next: " + nextItemPage)

            //pm_log("End pos: " + currentPosition)
            return {
                currentItem: beginningItem, //item at or before the beat
                nextItem: endingItem, //item after the beat
                percent : percent //percent that describes the distance
            }
     }

    //get the position (coordinates) for a certain beat
    this.getPositionForBeat = function(beat) {
        //pm_log("Get position for beat: " + beat,10)
        //get the elements on either side
        var ts = this.getElementsForBeat(beat)

        //pm_log(ts,10)

        //use the ids to get the actual elements
        var currentItem = this.id(ts.currentItem.noteId) //this.id("note" + ts.currentItemIndex)
        var nextItem = this.id(ts.nextItem.noteId) //this.id("note" + ts.nextItemIndex)

        var staveYPos = currentItem.stave.getYForLine(0)
        var initialPos = this.middlePositionOfItem(currentItem)

        //find the middles of the items
        var distance = this.middlePositionOfItem(nextItem) - this.middlePositionOfItem(currentItem)

        if (
          (currentItem.stave.getBoundingBox().y != nextItem.stave.getBoundingBox().y)
          ||
          (currentItem.stave.getBoundingBox().x > nextItem.stave.getBoundingBox().x)
           ) {
            //the nextItem appears on the next line
            //or, if the nextItem is before the current item due to a repeat
            distance = currentItem.stave.end_x - this.middlePositionOfItem(currentItem)
        }

        return {
                x: (initialPos + distance * ts.percent),
                y: staveYPos,
                page: ts.currentItem.page
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

    this.getPageForBeat = function(beat) {
      var ts = this.getElementsForBeat(beat)
      return ts.currentItem.page
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

    this.createFeedbackHTMLElement = function(feedbackType,feedbackItemsArray, beat) {
        var positionForBeat = this.getPositionForBeat(beat)
        var x = positionForBeat.x
        var y = this.getFeedbackYPosition(positionForBeat.y)
        var pageNum = positionForBeat.page

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

        var feedbackContainerDivId = 'feedbackItem_x' + x + '_y' + y
        var feedbackContainerObj = document.getElementById(feedbackContainerDivId)

        if (feedbackContainerObj == undefined) {
          feedbackContainerObj = document.createElement("div")
          feedbackContainerObj.className = "feedbackItemContainer"
          feedbackContainerObj.id = feedbackContainerDivId
        } else {
          //make the separator
          var separator = document.createElement("div")
          separator.className = "feedbackSeparator"
          feedbackContainerObj.appendChild(separator)
        }


        feedbackItems.forEach(function(item) {
            feedbackContainerObj.appendChild(item)
        })

        obj.appendChild(feedbackContainerObj)

        obj.style.position = "absolute"
        obj.style.top = "" + y  * this.contentScaleFactor + "px"
        obj.style.left = "" + x * this.contentScaleFactor - (feedbackWidth / 2) + "px"

        document.getElementById("notationPage_page" + pageNum).appendChild(obj)
    }

}
