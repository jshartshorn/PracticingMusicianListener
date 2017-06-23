

VF = Vex.Flow;

function concat(a, b) { return a.concat(b); }


var EasyScoreUtil = {

    scorePositionX : 60,
    scorePositionY : 0,


    vf : null,
    registry: null,
    score: null,
    voice: null,
    beam: null,

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


    id: function (id) { return registry.getElementById(id); },


    notesFromKotlinNotationItems : function(notes) {
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
                    break
                    default:
                    console.log("Not found " + item.constructor.name)
                    break
                }


            }

            //console.log("Came up with : " + items)

            return {
                bars: bars,
                beats: totalDuration
            }
        },

    notateExercise: function(exercise) {

        this.score.set({ time: '4/4' });

        for (barIndex in exercise.bars) {
            console.log("Making bar...")

            var measureWidth = 160;

            if (barIndex == 0) {
                measureWidth = 220;
            }

            var system = EasyScoreUtil.makeSystem(measureWidth);

            var bar = exercise.bars[barIndex]

            console.log("Content: ")
            console.log(bar)

            var notesString = bar.join(",")

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
    }

}