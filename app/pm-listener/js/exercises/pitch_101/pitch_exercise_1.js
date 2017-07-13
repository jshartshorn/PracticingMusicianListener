function generateExerciseForKotlin() {
    return {
        tempo: 110,
        notes: [
            {noteNumber: 62, duration: 4.0},
            {noteNumber: 62, duration: 4.0},
            {noteNumber: 60, duration: 2.0},
            {noteNumber: 62, duration: 2.0},
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 62, duration: 1.0},
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 62, duration: 1.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "Little Ditty 1",
        author: "Jake Douglass",
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['D4/w']}]
            },
            {
                            groups:[{notes:['D4/w']}]
                        },
            {
                            groups:[{notes:['C4/h','D4/h']}]
                        },
            {
                            groups:[{notes:['C4/q','D4/q','C4/q','D4/q']}]
                        },
            ],
        copyrightInfo: "© Copyright 2017"
        }
}
