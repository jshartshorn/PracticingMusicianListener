function generateExerciseForKotlin() {
    return {
        tempo: 110,
        notes: [
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 4.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "Rhythm Exercise 5",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['B4/h','B4/h']}]
            },
            {
                            groups:[{notes:['B4/q','B4/q','B4/q','B4/q']}]
                        },
            {
                            groups:[{notes:['B4/h','B4/q','B4/q']}]
                        },
            {
                            groups:[{notes:['B4/w']}]
                        },
            ],
        copyrightInfo: "This arrangement © Copyright 2006 Something Music Limited.<br/> All Rights Reserved. International Copyright Secured."
        }
}
