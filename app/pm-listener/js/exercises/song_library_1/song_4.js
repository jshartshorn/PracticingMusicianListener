//TODO: complete once pickup measures are done

function generateExerciseForKotlin() {
    return {
    //TODO: make these match
        tempo: 110,
        notes: [
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 72, duration: 2.0},
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 72, duration: 1.0},
            {noteNumber: 71, duration: 4.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        //TODO - pickup note
        title: "A Tisket, a Tasket",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                alternate_timeSignature:"1/4",
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['G4/q']}]
            },
            { groups:[{notes:['G4/h','E4/q','A4/q']}] },
            ],
        copyrightInfo: ""
        }
}
