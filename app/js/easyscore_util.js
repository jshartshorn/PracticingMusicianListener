

VF = Vex.Flow;

function concat(a, b) { return a.concat(b); }


var EasyScoreUtil = {

    scorePositionX : 60,
    scorePositionY : 0,

    exercise: null,

    vf : null,
    registry: null,
    score: null,
    voice: null,
    beam: null,

    noteIDNumber: 0,

    systems: Array(),

    setupOnElement: function(elementID) {
        this.vf = new Vex.Flow.Factory({
                renderer: {selector: elementID, width: 1100, height: 900}
                });

        this.registry = new VF.Registry();
        VF.Registry.enableDefaultRegistry(this.registry);

        this.score = this.vf.EasyScore({ throwOnError: true });

        this.voice = this.score.voice.bind(this.score);
        this.notes = this.score.notes.bind(this.score);
        this.beam = this.score.beam.bind(this.score);
    },

    makeSystem: function (width) {

        var system = this.vf.System({ x: this.scorePositionX, y: this.scorePositionY, width: width, spaceBetweenStaves: 10 });
        this.scorePositionX += width;
        return system;
    },


    id: function (id) { return this.registry.getElementById(id); },


    notesFromKotlinNotationItems : function(notes) {
            var rawNotes = Array() //just the raw notes, without bar numbers

            var bars = Array()
            var arrayOfNotes = notes.toArray()

            var totalDuration = 0

            var currentBar = Array()

            for (index in arrayOfNotes) {
                var item = arrayOfNotes[index]
                //console.log("Checking item " + item.constructor.name)

                switch(item.constructor.name) {
                    case "Barline":
                    bars.push(currentBar)
                    currentBar = Array()
                    break
                    case "Note":
                    var duration = function() {
                        switch(item.duration) {
                            case 1.0:
                            return "q"
                            default:
                            console.log("Duration error")
                            return "err"
                        }
                    }()
                    totalDuration += item.duration
                    //items.push( new VF.StaveNote({clef: "treble", keys: [item.textValue], duration: duration }) )
                    currentBar.push(item.textValue)

                    rawNotes.push(item)

                    break
                    default:
                    console.log("Not found " + item.constructor.name)
                    break
                }


            }

            //console.log("Came up with : " + items)

            return {
                rawNotes: rawNotes,
                bars: bars,
                beats: totalDuration
            }
        },

    notateExercise: function() {

        this.score.set({ time: '4/4' });

        for (barIndex in this.exercise.bars) {
            console.log("Making bar...")

            var measureWidth = 160;

            if (barIndex == 0) {
                measureWidth = 220;
            }

            var system = EasyScoreUtil.makeSystem(measureWidth);

            this.systems.push(system)

            var bar = this.exercise.bars[barIndex]

            console.log("Content: ")
            console.log(bar)


            var notesString = ""

            for (var noteIndex in bar) {
                var note = bar[noteIndex]

                if (noteIndex > 0) {
                    notesString += ","
                }
                notesString += note

                notesString += "[id=\"note" + this.noteIDNumber + "\"]"

                this.noteIDNumber++
            }

            //var notesString = bar.join(",")

            console.log(notesString)

            var stave = system.addStave({ voices: [this.voice(this.notes(notesString))] });

            if (barIndex == 0) {
                stave.addClef('treble')
                stave.addKeySignature("C")
                stave.addTimeSignature("4/4")
            }
        }

        this.vf.draw();
        VF.Registry.disableDefaultRegistry();
    },



    getElementsForBeat: function(beat) {
            //convert beat to 0 index rather than 1


            var currentPosition = 0

            var beginningItemIndex = null
            var endingItemIndex = null

            var firstItemBeatPosition = 0
            var lastItemBeatPosition = 0

            var percent = null

            console.log("Searching for beat " + beat + " in")
            console.log(this.exercise.rawNotes)

            for (index in this.exercise.rawNotes) {
                var item = this.exercise.rawNotes[index]

                var duration = item.duration

                if (currentPosition < beat) {
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

            console.log("End pos: " + currentPosition)
            return {
                "currentItemIndex": beginningItemIndex,
                "nextItemIndex": endingItemIndex,
                "percent" : percent
            }
     },

    getPositionForBeat: function(beat) {
             var ts = EasyScoreUtil.getElementsForBeat(beat)

             var currentItem = EasyScoreUtil.id("note" + ts.currentItemIndex)
             var nextItem = EasyScoreUtil.id("note" + ts.nextItemIndex)

             var distance = EasyScoreUtil.middlePositionOfItem(nextItem) - EasyScoreUtil.middlePositionOfItem(currentItem)
             var initialPos = EasyScoreUtil.middlePositionOfItem(currentItem)

             return initialPos + distance * ts.percent

      },

     middlePositionOfItem: function(item) {
              return item.getAbsoluteX() + item.getBoundingBox().w / 2.0
      },


    drawIndicatorLine: function(canvas, indicatorPosition) {

            var indicatorOverflow = 20

            var stave = this.systems[0].parts[0].stave

            var topY = stave.getYForLine(0) - indicatorOverflow
            var bottomY = stave.getYForLine(4) + indicatorOverflow

            if (canvas.getContext) {

            	   // use getContext to use the canvas for drawing
            	   var ctx = canvas.getContext('2d');

                   ctx.strokeStyle = '#4990E2';
                   ctx.lineWidth = 3;

            	   // Stroked triangle
            	   ctx.beginPath();
            	   ctx.moveTo(indicatorPosition,bottomY);
            	   ctx.lineTo(indicatorPosition,topY);
            	   ctx.closePath();
            	   ctx.stroke();

              }
        },

}