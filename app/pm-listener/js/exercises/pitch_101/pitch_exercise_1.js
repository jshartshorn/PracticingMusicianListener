function generateExerciseForKotlin() {
    return {
        tempo: 110,
        count_off: 4,
        time_signature: 4,
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
        systems: [{bars: [
            {
                extra_attributes:{time_signature:'4/4',clef:'treble',key_signature:"C"},
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
            ],}],
        copyrightInfo: "© Copyright 2017"
        }
}
