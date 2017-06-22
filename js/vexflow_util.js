
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

    animateIndicatorLine: function(canvas, stave, indicatorItem1, indicatorItem2, time) {
        var indicatorPosition1 = indicatorItem1.getAbsoluteX() + indicatorItem1.getBoundingBox().w / 2.0
        var indicatorPosition2 = indicatorItem2.getAbsoluteX() + indicatorItem2.getBoundingBox().w / 2.0

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

            console.log("Animating..." + percentageDone)

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
            console.log("Checking item " + item.constructor.name)

            switch(item.constructor.name) {
                case "Barline":
                console.log("Bar line")
                items.push(new VF.BarNote());
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
                items.push( new VF.StaveNote({clef: "treble", keys: [item.textValue], duration: duration }) )
                break
                default:
                console.log("Not found " + item.constructor.name)
                break
            }


        }

        console.log("Came up with : " + items)

        return {
            notes: items,
            beats: totalDuration
        }
    },


}
