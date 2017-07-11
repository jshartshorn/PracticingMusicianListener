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

            {noteNumber: 60, duration: 1.0},
                        {noteNumber: 62, duration: 1.0},
                        {noteNumber: 64, duration: 1.0},
                        {noteNumber: 65, duration: 1.0},
                        {noteNumber: 67, duration: 1.0},
                        {noteNumber: 69, duration: 1.0},
                        {noteNumber: 71, duration: 1.0},
                        {noteNumber: 72, duration: 1.0},

            {noteNumber: 60, duration: 1.0},
                        {noteNumber: 62, duration: 1.0},
                        {noteNumber: 64, duration: 1.0},
                        {noteNumber: 65, duration: 1.0},
                        {noteNumber: 67, duration: 1.0},
                        {noteNumber: 69, duration: 1.0},
                        {noteNumber: 71, duration: 1.0},
                        {noteNumber: 72, duration: 1.0},

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
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}]
            },
            {
                            groups:[{notes:['G5/q','A4/q','B4/q','C5/q']}]
                        },
            {
                                        groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}]
                                    },
            {
                                        groups:[{notes:['G4/q','A4/q','B4/q','C5/q']}]
                                    },
            {
                extra_attributes:[{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                                        groups:[{notes:['C5/q','D5/q','E5/q','F5/q']}]
                                    },
            {
                                        groups:[{notes:['G5/q','A5/q','B5/q','C6/q']}]
                                    },
            {
                                        groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}]
                                    },
            {
                                        groups:[{notes:['G4/q','A4/q','B4/q','C5/q']}]
                                    },
            ]
        }
}
