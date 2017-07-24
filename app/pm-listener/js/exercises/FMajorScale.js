function generateExerciseForKotlin() {
    return {
        tempo: 120,
        count_off: 8,
        time_signature: 4,
        notes: [
            {noteNumber: 65, duration: 1.0},
            {noteNumber: 67, duration: 1.0},
            {noteNumber: 69, duration: 1.0},
            {noteNumber: 70, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 74, duration: 1.0},
            {noteNumber: 76, duration: 1.0},
            {noteNumber: 77, duration: 1.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "F Major Scale",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 120,
        systems:[{bars: [
            {
                extra_attributes:{time_signature:'4/4',clef:'treble',key_signature:"F"},
                groups:[{notes:['F4/q','G4/q','A4/q','Bb4/q']}]
            },
            {
                            groups:[{notes:['C5/q','D5/q','E5/q','F5/q']}]
                        },
            ]}],
        copyrightInfo: "© Copyright 2017"
        }
}
