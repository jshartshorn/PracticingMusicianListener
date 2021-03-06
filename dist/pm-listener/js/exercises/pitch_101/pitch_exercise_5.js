function generateExerciseForKotlin() {
    return {
        tempo: 110,
        count_off: 8,
        time_signature: 4,
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

function generateExerciseEasyScoreCode() {
    return {
        title: "Little Ditty 5",
        author: "Jake Douglass",
        time_signature: "4/4",
        tempo: 110,
        systems:[{bars: [
            {
                extra_attributes:{time_signature:'4/4',clef:'treble',key_signature:"C"},
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
            ],}],
        copyrightInfo: "© Copyright 2017"
        }
}
