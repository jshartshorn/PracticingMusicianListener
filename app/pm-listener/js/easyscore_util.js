/*
 * This is a helper that should be the interface to most of what the app does with VexFlow,
 * specifically using the EasyScore system
 *
 * Written as a global variable, but it does store some state information, since the notation should
 * only be done once
 */
var VF = Vex.Flow

//helper function
function concat(a, b) {
	return a.concat(b)
}

var indicatorCanvasName = "indicatorCanvas"

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
	this.registry = null
	//helper function to get easy access to notes later on
  this.notesById = {} //filled to replace VexFlow ids
	this.id = function(id) {
		return this.notesById[id]
	}
	this.vfs = [] //the vf for each page

	//array of systems (really measures...) that have been added to the screen
	//useful for getting placement information later
	this.staves = Array()

	//formatting info for the notation
	this.contentScaleFactor = 1.0
	this.useScaling = true
	this.assumedCanvasWidth = 1124 //this will never change, although the scaling factor will change this
	this.barHeight = 160
	this.firstBarAddition = 100

	this.feedbackMargin = 20

	this.numberOfSystemsPerPage = 999 //avoids pagination for now
	this.numberOfPages = -1 //will get set later

	this.scoreWidth = 0

	//counter so that we can get an individual ID for each note
	this.noteIDNumber = 0

	//tempo slider magic numbers
	this.sliderMin = 40
	this.sliderMax = 220
	this.sliderIncrement = 20

	//setup the basic notation stuff
	this.setupOnElement = function(elementID) {

		this.registry = new VF.Registry()
		VF.Registry.enableDefaultRegistry(this.registry)

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

		pm_log("Total width will be " + totalWidthWillBe, 10)
		pm_log("Total height will be " + totalLines * this.barHeight)

		var indicatorCanvas = document.getElementById(indicatorCanvasName)

		pm_log("Setting up indicator canvas", 10)
		pm_log(indicatorCanvas, 10)

		indicatorCanvas.width = pageWidth
		indicatorCanvas.height = pageHeight

		for (var i = 0; i < this.numberOfPages; i++) {
			var page = document.createElement("div")
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
			})

			curVf.context.scale(this.contentScaleFactor, this.contentScaleFactor)

			this.vfs.push(curVf)

		}

		//set up the pagination controls
		this.buildPaginationControls(elementID)
	}

	this.buildPaginationControls = function(elementID) {
		if (this.numberOfPages <= 1) {
			return
		}

		var paginationControls = document.createElement("div")
		paginationControls.id = "notationPaginationControls"

		var previousPageLink = document.createElement("span")
		previousPageLink.className = "paginationLink"
		previousPageLink.id = "paginationPreviousPage"
		previousPageLink.innerHTML = ""
		paginationControls.appendChild(previousPageLink)

		var pageText = document.createElement("span")
		pageText.id = "paginationLabel"
		pageText.innerHTML = "page"
		paginationControls.appendChild(pageText)

		var nextPageLink = document.createElement("span")
		nextPageLink.className = "paginationLink"
		nextPageLink.id = "paginationNextPage"
		nextPageLink.innerHTML = ""
		paginationControls.appendChild(nextPageLink)

		var notationBody = document.getElementById(elementID)
		notationBody.appendChild(paginationControls)

		this.setPaginationControlsState()
	}

	this.setPaginationControlsState = function() {
	  if (this.numberOfPages <= 1) { return }

		var pageText = document.getElementById("paginationLabel")
		pageText.innerHTML = "page " + (this.currentVisiblePageNumber + 1) + " / " + this.numberOfPages

		var showPage = this.showPageNumber.bind(this)
		var currentVisiblePageNumber = this.currentVisiblePageNumber

		var previousPageLink = document.getElementById("paginationPreviousPage")
		if (currentVisiblePageNumber > 0) {
			previousPageLink.onclick = function() {
				showPage(currentVisiblePageNumber - 1)
			}
			previousPageLink.className = "paginationLink pageBackward"
		} else {
			previousPageLink.onclick = null
			previousPageLink.className = "paginationLink pageBackward disabled"
		}

		var nextPageLink = document.getElementById("paginationNextPage")
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

			if (currentClass == "playing" && className == "stopped")
				className = "restart"

			button.className = className
		}
	}

	this.displayMedal = function(medalClass) {
		var medalIndicator = document.getElementById("medalIndicator")
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
		notationBody.insertBefore(titleContainer, notationBody.childNodes[0])

		//the bottom info
		var copyrightInfoContainer = document.getElementById("copyrightContainer")
		if (copyrightInfoContainer != null) {
			copyrightInfoContainer.parentNode.removeChild(copyrightInfoContainer)
		}

		//build the new one
		copyrightInfoContainer = document.createElement("div")
		copyrightInfoContainer.id = "copyrightContainer"

		copyrightInfoContainer.innerHTML = this.exercise.copyrightInfo + " v1.0b1"

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

  this.setupToleranceControls = function() {
    var toleranceDiv = document.getElementById("toleranceControls")
    if (toleranceDiv != null) return

    toleranceDiv = document.createElement("div")
    toleranceDiv.id = "toleranceControls"

    toleranceDiv.innerHTML = '<h2>Tolerance controls</h2>'
 + '      <style>'
 + '        span.toleranceLabel {'
 + '          width: 300px;'
 + '          display: inline-block;'
 + '        }'
 + '        div#toleranceControls input {'
 + '          width: 70px;'
 + '        }'
 + '      </style>'
 + '      <span class="toleranceLabel">allowableCentsMargin (0-50)</span><input type="text" id="allowableCentsMargin"/><br/>'
 + '      <span class="toleranceLabel">allowableRhythmMargin (0-1.0)</span><input type="text" id="allowableRhythmMargin"/><br/>'
 + '      <span class="toleranceLabel">allowableDurationRatio (0-1.0)</span><input type="text" id="allowableDurationRatio"/><br/>'
 + '      <br/>'
 + '      <br/>'
 + '      <span class="toleranceLabel">largestBeatDifference (0-1.0)</span><input type="text" id="largestBeatDifference"/><br/>'
 + '      <span class="toleranceLabel">largestDurationRatioDifference(0-1.0)</span><input type="text" id="largestDurationRatioDifference"/><br/>'
 + '      <span class="toleranceLabel">minDurationInBeats(0-1.0)</span><input type="text" id="minDurationInBeats"/><br/>'

    document.getElementById("notationWindow").insertBefore(toleranceDiv,document.getElementById('notationHeader'))

    document.getElementById('allowableCentsMargin').value = listenerApp.parameters.allowableCentsMargin
    document.getElementById('allowableRhythmMargin').value = listenerApp.parameters.allowableRhythmMargin
    document.getElementById('allowableDurationRatio').value = listenerApp.parameters.allowableDurationRatio

    document.getElementById('largestBeatDifference').value = listenerApp.parameters.largestBeatDifference
    document.getElementById('largestDurationRatioDifference').value = listenerApp.parameters.largestDurationRatioDifference
    document.getElementById('minDurationInBeats').value = listenerApp.parameters.minDurationInBeats
  }

	this.setupControls = function() {
		console.log("Setting on controls")

    this.setupToleranceControls()

		var metronomeSlider = document.getElementById("metronomeSlider")
		if (metronomeSlider != null) {
			metronomeSlider.type = "range"
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
				//Don't store this with the server -- keep the default tempo
				//updateSettingsViaNetwork()
			}
		}

		var sliderNumbersContainer = document.getElementById("sliderNumbers")

		if (sliderNumbersContainer != null) {
			while (sliderNumbersContainer.firstChild) {
				sliderNumbersContainer.removeChild(sliderNumbersContainer.firstChild)
			}
			for (var i = this.sliderMin; i < this.sliderMax; i += this.sliderIncrement) {
				var sliderNumberSpan = document.createElement("span")
				sliderNumberSpan.className = "sliderNumber"
				sliderNumberSpan.id = "sliderNumber" + i
				sliderNumberSpan.innerHTML = "" + i
				sliderNumbersContainer.appendChild(sliderNumberSpan)

				var sliderNumberSeparator = document.createElement("span")
				sliderNumberSeparator.className = "sliderNumberSeparator"
				sliderNumbersContainer.appendChild(sliderNumberSeparator)
			}
		}

		var metronomeAudioButton = document.getElementById("metronomeAudioButton")
		if (metronomeAudioButton != null) {
			var audioOn = listenerApp.getMetronomeAudio()

			metronomeAudioButton.className = audioOn ? "checked" : ""

			metronomeAudioButton.onclick = function() {
				var newPref = !listenerApp.getMetronomeAudio()

				if (newPref == true) {
					listenerApp.parameters.displaySiteDialog({
						modalType: "audio",
						message: "To reduce microphone interference, use headphones.",
					})
				}

				listenerApp.alterPreferences({
					metronomeSound: newPref
				})

				metronomeAudioButton.className = newPref ? "checked" : ""

				updateSettingsViaNetwork({
					metronome_audio_on: newPref
				})
			}
		}
	}

	this.setupMetronome = function(metronomeContainerName) {
		//remove the old ones
		var myNode = document.getElementById(metronomeContainerName)
		while (myNode != null && myNode.firstChild) {
			myNode.removeChild(myNode.firstChild)
		}

		console.log("Making metronome for " + this.exercise.time_signature)
		var metronomeItemsToCreate = 1
		switch (this.exercise.time_signature) {
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
				var bpm = Number(val.target.value)
				if (isNaN(bpm) || ((bpm < 40 || bpm > 220))) {
					alert("Invalid tempo")
					val.target.value = listenerApp.getTempo()
					return
				}
				listenerApp.alterPreferences({
					bpm: bpm
				})
				var metronomeSlider = document.getElementById("metronomeSlider")
				metronomeSlider.value = bpm

			}
		}
	}

	this.makeStave = function(options, vf) {
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

		var system = vf.Stave({
			x: this.scorePositionX,
			y: this.scorePositionY,
			width: width,
			spaceBetweenStaves: 10
		})

		this.measureCounter += 1
		this.scorePositionX += width

		return system
	}

  this.notateExercise = function() {

    var totalBars = this.exercise.systems.reduce(function(total, cur) {
      return total + cur.bars.length
    }, 0)


    var barCounter = 0

		var currentClef = "treble"

    for (var lineIndex in this.exercise.systems) {
      var curPageNumber = Math.floor(lineIndex / this.numberOfSystemsPerPage)

      var curVf = this.vfs[curPageNumber]


			//is it the beginning of a new page
			var isNewPage = (curPageNumber == lineIndex / this.numberOfSystemsPerPage)

			if (isNewPage) {
				this.scorePositionY = 0
			}

      var curLine = this.exercise.systems[lineIndex]

      for (var barIndex in curLine.bars) {
        var beams = []

				var curBar = curLine.bars[barIndex]

				if (curBar.extra_attributes != undefined && curBar.extra_attributes.clef != undefined) {
					currentClef = curBar.extra_attributes.clef
				}

				var barTime = this.exercise.time_signature

				if (curBar.extra_attributes != undefined && curBar.extra_attributes.alternate_timeSignature != undefined) {
					barTime = curBar.extra_attributes.alternate_timeSignature
				}

				var barOptions = {
					barsInSystem: curLine.bars.length,
					positionInLine: barIndex
				}

				if (curBar.extra_attributes != undefined && curBar.extra_attributes.pickup_bar != undefined) {
					if (curBar.extra_attributes.pickup_bar == true) {
						barOptions["pickup_bar"] = true
					}
				}

				var stave = this.makeStave(barOptions,curVf);
        stave.setContext(curVf.context);
        this.staves.push(stave)

        if (curBar.extra_attributes != undefined) {
					for (var attr in curBar.extra_attributes) {
						var value = curBar.extra_attributes[attr]
						switch (attr) {
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

                switch (barline.style) {
                  case "LightHeavy":
                    stave.setEndBarType(VF.Barline.type.END)
                    break;
                  default:
                    break;
                }

								switch (barline.repeatType) {
								case "":
								  //nothing to include
								  break
								case "begin":
									stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN)
									break
								case "end":
									stave.setEndBarType(VF.Barline.type.REPEAT_END)
									break
								default:
									pm_log("Unknown attribute:" + attr, 10)
								}
							})

							break
						default:
							pm_log("Unknown attribute:" + attr, 10)
							break
						}
					}
				}

				//if it's the last bar, make the bar line the correct end bar
				if (barCounter == totalBars - 1) {
					//stave.setEndBarType(VF.Barline.type.END)
				}


        stave.draw();

        var vfVoices = []


        for (var voiceKey in curBar.voices) {

          //console.log("Easy score voice:  " + voiceKey)

          var voice = curBar.voices[voiceKey]

          var vfVoice = curVf.Voice();
          vfVoice.setStrict(false) //TODO: remove this and set the time
          vfVoices.push(vfVoice)

          var vfNotes = []

          for (var groupIndex in voice.groups) {

            //console.log("Group: " + groupIndex)

            var curGroup = voice.groups[groupIndex]

            console.log(curGroup)

            var brokenUpNotes = curGroup.notes //[0].split(",")

            var groupNotes = []

            for (var noteIndex in brokenUpNotes) {
              var notes = brokenUpNotes[noteIndex]

              var keys = []
              var duration = ""
              for (var i in notes) {
                var note = notes[i]
                var notehead = (note.notehead == undefined ? "" : "/" + note.notehead + "2") //warning brittle
                var key = note.pitch + "/" + note.octave + notehead
                duration = "" + note.duration + (note.rest ? "r" : "")
                keys.push(key)
              }
              //set the page number so that we can find it later

              var otherNote = this.exercise.notes.find(function(n) {
                return n.noteId == notes[0].id
              }).page = curPageNumber

              //console.log("Making note out of:")
              //console.log(note)

              var vfNote = curVf.StaveNote({
                keys: keys,
                duration: duration,
                clef: currentClef,
              })

              for (var i in notes) {
                var note = notes[i]

                if (note.duration == "w" && note.rest) {
                  vfNote.align_center = true
                  vfNote.x_shift = 0
                }

                if (note.accidental != "") {
                  vfNote.addAccidental(i, new VF.Accidental(note.accidental))
                }

                note.attributes.forEach(function(attr) {
                  switch (attr.key) {
                  case "bowing":
                    var symbol = function(bowDirection) {
                      return bowDirection == "up" ? "a|" : "am"
                    }(attr.value)
                    vfNote.addArticulation(i, new VF.Articulation(symbol).setPosition(3))
                    break
                  case "textAnnotation":
                    vfNote.addAnnotation(i, new VF.Annotation(attr.value).setPosition(3))
                    break
                  case "stem":
                    var stem_direction = 1
                    if (attr.value == "down") stem_direction = -1
                    vfNote.setStemDirection(stem_direction)
                    break
                  default:
                    console.warn("Unknown note attribute: ")
                    console.log(attr)
                  }
                })

              }

              this.notesById[note.id] = vfNote

              //console.log("note:")
              //console.log(vfNote)

              vfNotes.push(vfNote)
              groupNotes.push(vfNote)

              this.noteIDNumber++
            }

            if (curGroup.beam === true) {
              var beam = curVf.Beam({notes: groupNotes})
              beams.push(beam)
            }

          }

          vfVoice.addTickables(vfNotes)
          if (vfVoice.tickables.length == 0)
            vfVoices.splice(vfVoices.indexOf(vfVoice))

        }

        var formatter = new curVf.Formatter().
          joinVoices(vfVoices).formatToStave(vfVoices, stave);

        vfVoices.forEach(function(voice) {
          voice.draw(curVf.context,stave)
        })

        beams.forEach(function(beam) {
          console.log("Drawing beam")
          beam.draw()
        })

        barCounter++;
			}

    }

    console.log("notated")

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

//		pm_log("Searching for beat " + beat + " in",10)
//		pm_log(this.exercise.notes,10)

		//this pulls from generatedExercise, which is the non-EasyScore set of notes and durations
		for (var index in this.exercise.notes) {
			var item = this.exercise.notes[index]

			var duration = item.duration

			if (currentPosition <= beat) {
				beginningItem = item
				endingItem = item

				firstItemBeatPosition = currentPosition
				lastItemBeatPosition = currentPosition
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
			percent: percent //percent that describes the distance
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
			(currentItem.stave.getBoundingBox().y != nextItem.stave.getBoundingBox().y) ||
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
		return this.staves[0]
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
			var ctx = canvas.getContext("2d")

			ctx.strokeStyle = "#4990E2"
			ctx.lineWidth = 3

			// Stroked path
			ctx.beginPath()
			ctx.moveTo(indicatorPosition.x * this.contentScaleFactor, bottomY * this.contentScaleFactor)
			ctx.lineTo(indicatorPosition.x * this.contentScaleFactor, topY * this.contentScaleFactor)
			ctx.closePath()
			ctx.stroke()

		}
	}

	//get the Y coordinate for feedback items
	this.getFeedbackYPosition = function(topStaveY) {
		var stave = this.getBasicStave()
		var pos = stave.height + topStaveY + this.feedbackMargin
		return pos
	}

	this.createFeedbackHTMLElement = function(feedbackType, feedbackItemsArray, beat) {
		var positionForBeat = this.getPositionForBeat(beat)
		var x = positionForBeat.x
		var y = this.getFeedbackYPosition(positionForBeat.y)

		//see if we need to increment it because of a repeat
		var feedbackObjectID = ""
		while (true) {
		  feedbackObjectID = "__feedbackItem_x" + x + "_y" + y
		  if (document.getElementById(feedbackObjectID) == undefined) {
		    break
		  }
		  y += this.feedbackMargin
		}

		var pageNum = positionForBeat.page

		var feedbackWidth = 16 * this.contentScaleFactor
		var obj = document.createElement("div")
		obj.className = "feedbackItem"
		obj.id = feedbackObjectID

		//console.log("Feedback type:")
		//console.log(feedbackType.name$)

		switch (feedbackType.name$) {
		case "Missed":
			obj.className += " incorrect_note"
			break
		case "Incorrect":
			obj.className += " off_note"
			break
		case "Correct":
			obj.className += " correct"
			break
		default:
			pm_log("Error on type: " + feedbackType.name$, 10)
			break
		}

		var feedbackItems = feedbackItemsArray.map(function(item) {
			var itemObj = document.createElement("span")
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

    //see if there's already one at that location
    //TODO: should be redundant now with above check for feedbackItem
		var feedbackContainerDivId = "feedbackItem_x" + x + "_y" + y
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
		obj.style.top = "" + y * this.contentScaleFactor + "px"
		obj.style.left = "" + x * this.contentScaleFactor - (feedbackWidth / 2) + "px"

		document.getElementById("notationPage_page" + pageNum).appendChild(obj)
	}

}
