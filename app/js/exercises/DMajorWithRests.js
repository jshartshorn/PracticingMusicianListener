function generateExerciseForKotlin() {
    return {
        tempo: 110,
        notes: [
            {noteNumber: 62, duration: 0.5},
            {noteNumber: 64, duration: 0.5},
            {noteNumber: 66, duration: 0.5},
            {noteNumber: 67, duration: 0.5},
            {noteNumber: 69, duration: 1.0},
            {noteNumber: -1, duration: 1.0},

            {noteNumber: 69, duration: 0.5},
            {noteNumber: 67, duration: 0.5},
            {noteNumber: 66, duration: 0.5},
            {noteNumber: 64, duration: 0.5},
            {noteNumber: 62, duration: 0.5},
            {noteNumber: -1, duration: 1.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"D"}],
                groups:[
                        {
                            beam:true,
                            stem_direction:"up",
                            notes:['D4/8','E4','F4','G4']
                        },
                        {
                            notes:['A4/q','B4/q/r']
                        },
                    ]

            },
            {
                groups:[
                                        {
                                            beam:true,
                                            stem_direction:"up",
                                            notes:['A4/8','G4','F4','E4']
                                        },
                                        {
                                            notes:['D4/q','B4/q/r']
                                        },
                                    ]
            }
        ]
    }
}