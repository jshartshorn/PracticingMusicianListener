
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

    drawIndicatorLine: function(canvas, stave, indicatorItem) {
        var indicatorPosition = indicatorItem.getAbsoluteX() + indicatorItem.getBoundingBox().w / 2.0

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
    }

}
