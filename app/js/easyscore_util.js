var scorePositionX = 60
var scorePositionY = 0

var EasyScoreUtil = {



    makeSystem: function (width) {

        var system = vf.System({ x: scorePositionX, y: scorePositionY, width: width, spaceBetweenStaves: 10 });
        scorePositionX += width;
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


}