function generateExerciseForKotlin() {
    return {
        tempo: 110,
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
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}]
            },
            {
                            groups:[{notes:['G4/q','A4/q','B4/q','C5/q']}]
                        },
            ]
        }
}