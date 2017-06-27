//NOT USED AT THE MOMENT


VF = Vex.Flow;

var VexFlowUtil = {

    setupCanvas : function(canvas) {
        var renderer = new VF.Renderer(canvas, VF.Renderer.Backends.CANVAS);

        var context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#ccc");

        return context;
    },

    createStave : function(staveWidth) {
        var stave = new VF.Stave(20, 40, staveWidth);
        return stave;
    },

    inputExercise : function(context, stave, exercise) {
        var notes = exercise.notes;
        var beats = exercise.beats;

        // Create a voice in 4/4 and add above notes
        var voice = new VF.Voice({num_beats: beats,  beat_value: 4});
        voice.addTickables(notes);

        // Format and justify the notes to 400 pixels.
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], stave.end_x - VexFlowUtil.getNotationStartX(stave));

        // Render voice
        voice.draw(context, stave);

        return voice;
    },

    getNotationStartX: function(stave) {
        return stave.start_x;
    },

    getPositionForBeat: function(tickables, beat) {
        var ts = VexFlowUtil.getTickablesForBeat(tickables, beat)

        //pm_log("TS: at beat " + beat)
        //pm_log(ts)

        var distance = VexFlowUtil.middlePositionOfItem(voice.tickables[ts.nextItemIndex]) - VexFlowUtil.middlePositionOfItem(voice.tickables[ts.currentItemIndex])
        var initialPos = VexFlowUtil.middlePositionOfItem(voice.tickables[ts.currentItemIndex])

        return initialPos + distance * ts.percent

    },

    drawFeedbackOnTickable(canvas, tickableItem, feedbackItemType) {
        var boundingBox = tickableItem.getBoundingBox()
        var feedbackY = boundingBox.y + boundingBox.h
        var feedbackX = boundingBox.x

        VexFlowUtil.drawFeedbackAtPosition(feedbackItemType,feedbackX,feedbackY)

        //ctx.strokeRect(boundingBox.x,boundingBox.y,boundingBox.w,boundingBox.h)
    },

    drawFeedbackAtPosition(canvas,feedbackItemType,x,y) {
        var ctx = canvas.getContext('2d');

        ctx.font = "30px Arial"
        ctx.textBaseline = "top";
        ctx.fillText(feedbackItemType,x,y)

    },

    getFeedbackYPosition : function(stave) {
        return stave.getBoundingBox().y + stave.getBoundingBox().h
    },

    getTickablesForBeat: function(tickables, beat) {
            //convert beat to 0 index rather than 1

            //go through and find
            var beatSize = 4096

            var currentPosition = 0

            var beginningItemIndex = null
            var endingItemIndex = null

            var firstItemBeatPosition = 0
            var lastItemBeatPosition = 0

            var percent = null

            for (index in tickables) {
                var item = tickables[index]

                var duration = (item.ticks.numerator / beatSize)
                var type = item.constructor.name

                if (type != "StaveNote") {
                    //could be a bar line or something else we don't care about
                    continue
                }


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

            pm_log("End pos: " + currentPosition)
            return {
                "currentItemIndex": beginningItemIndex,
                "nextItemIndex": endingItemIndex,
                "percent" : percent
            }
     },


    middlePositionOfItem: function(item) {
        return item.getAbsoluteX() + item.getBoundingBox().w / 2.0
    },

    animateIndicatorLine: function(canvas, stave, indicatorItem1, indicatorItem2, time) {
        var indicatorPosition1 = VexFlowUtil.middlePositionOfItem(indicatorItem1)
        var indicatorPosition2 = VexFlowUtil.middlePositionOfItem(indicatorItem2)

        var distance = (indicatorPosition2 - indicatorPosition1)

        var endTime = -1

        var animate = function(timestamp) {
            if (endTime == -1) {
                endTime = timestamp + time
            }

            if (timestamp >= endTime) {
                //return
            } else {
                //keep animating
                 window.requestAnimationFrame(animate)
            }

            var percentageDone = 1.0 - ((endTime - timestamp) / time)

            //pm_log("Animating..." + percentageDone)

            var indicatorPosition = (distance * percentageDone) + indicatorPosition1

            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

            VexFlowUtil.drawIndicatorLine(canvas, stave, indicatorPosition)
        }

        window.requestAnimationFrame(animate)
    },

    drawIndicatorLine: function(canvas, stave, indicatorPosition) {

        var indicatorOverflow = 20

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


    notesFromKotlinNotationItems : function(notes) {
        var items = Array()
        var arrayOfNotes = notes.toArray()

        var totalDuration = 0

        for (index in arrayOfNotes) {
            var item = arrayOfNotes[index]
            //pm_log("Checking item " + item.constructor.name)

            switch(item.constructor.name) {
                case "Barline":
                items.push(new VF.BarNote());
                break
                case "Note":
                var duration = function() {
                    switch(item.duration) {
                        case 1.0:
                        return "q"
                        default:
                        pm_log("Duration error")
                        return "err"
                    }
                }()
                totalDuration += item.duration
                items.push( new VF.StaveNote({clef: "treble", keys: [item.textValue], duration: duration }) )
                break
                default:
                pm_log("Not found " + item.constructor.name)
                break
            }


        }

        //pm_log("Came up with : " + items)

        return {
            notes: items,
            beats: totalDuration
        }
    },


}
