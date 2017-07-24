function generateExerciseForKotlin() {
    return {
        tempo: 110,
        count_off: 8,
        time_signature: 4,
        notes: [
            {noteNumber: 60, duration: 1.0},
            {noteNumber: 62, duration: 1.0},
            {noteNumber: 64, duration: 1.0},
            {noteNumber: 65, duration: 1.0},
            {noteNumber: 67, duration: 1.0},
            {noteNumber: 69, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "C Major Scale",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 110,
        systems:[{bars: [
            {
                extra_attributes:{time_signature:'4/4',clef:'treble',key_signature:"C"},
                groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}]
            },
            {
                            groups:[{notes:['G4/q','A4/q','B4/q','C5/q']}]
                        },
            ],}],
        copyrightInfo: "© Copyright 2017"
        }
}
