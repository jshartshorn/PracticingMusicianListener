//TODO: complete once pickup measures are done

function generateExerciseForKotlin() {
    return {
    //TODO: make these match
        tempo: 110,
        notes: [
            {noteNumber: 60, duration: 2.0},
            {noteNumber: 72, duration: 2.0},
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 72, duration: 2.0},
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 60, duration: 4.0},
        ]
    }
}

var noteNumbers = {
  C4: 60,
  D4: 62,
  E4: 64,
  F4: 65,
  G4: 67,
  A4: 69,
  B4: 71,
  C5: 72
}

var durations = {
  q: 1.0,
  h: 2.0,
  w: 4.0
}

function generateExerciseEasyScoreCode() {
    return {
        title: "Good Morning to You",
        author: "Music: Ernst Richter / Lyrics: Abbie Farwell Brown ",
        time_signature: "4/4",
        tempo: 100,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['C4/h,C5/h']}]
            },
            {
                            groups:[{notes:['C4/q','C5/q','C5/q','C4/q']}]
                        },
            {
                            groups:[{notes:['C5/h','C4/q','C5/q']}]
                        },
            {
                            groups:[{notes:['C4/w']}]
                        },
            ],
        copyrightInfo: ""
        }
}
