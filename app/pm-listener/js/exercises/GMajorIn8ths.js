function generateExerciseForKotlin() {
    return {
        tempo: 110,
        count_off: 4,
        time_signature: 4,
        notes: [
            {noteNumber: 67, duration: 0.5},
            {noteNumber: 69, duration: 0.5},
            {noteNumber: 71, duration: 0.5},
            {noteNumber: 72, duration: 0.5},
            {noteNumber: 74, duration: 0.5},
            {noteNumber: 76, duration: 0.5},
            {noteNumber: 78, duration: 0.5},
            {noteNumber: 79, duration: 0.5},

            {noteNumber: 79, duration: 0.5},
            {noteNumber: 78, duration: 0.5},
            {noteNumber: 76, duration: 0.5},
            {noteNumber: 74, duration: 0.5},
            {noteNumber: 72, duration: 0.5},
            {noteNumber: 71, duration: 0.5},
            {noteNumber: 69, duration: 0.5},
            {noteNumber: 67, duration: 0.5},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "C Major Scale",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        systems:[{bars: [
            {
                extra_attributes:{time_signature:'4/4',clef:'treble',key_signature:"G"},
                groups:[
                        {
                            beam:true,
                            stem_direction:"down",
                            notes:['G4/8','A4','B4','C5']
                        },
                        {
                            beam:true,
                            stem_direction:"down",
                            notes:['D5/8','E5','F5','G5']
                        },
                    ]

            },
            {
                groups:[
                    {
                        beam:true,
                        stem_direction:"down",
                        notes:['G5/8','F5','E5','D5']
                    },
                    {
                        beam:true,
                        stem_direction:"down",
                        notes:['C5/8','B4','A4','G4']
                    }
                    ]
            }
        ]}],
    }
}
