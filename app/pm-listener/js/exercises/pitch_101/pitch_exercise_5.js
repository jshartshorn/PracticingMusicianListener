function generateExerciseForKotlin() {
    return {
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

function generateExerciseEasyScoreCode() {
    return {
        title: "Little Ditty 5",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 110,
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
        copyrightInfo: "This arrangement © Copyright 2006 Something Music Limited.<br/> All Rights Reserved. International Copyright Secured."
        }
}
