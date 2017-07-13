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
        author: "American Nursery Rhyme Arr: Van Alexander",
        time_signature: "4/4",
        tempo: 112,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                groups:[{notes:['B4/q','C5/q','C5/q','B4/q']}]
            },
            {
                            groups:[{notes:['C5/h','B4/h']}]
                        },
            {
                            groups:[{notes:['C5/q','B4/q','B4/q','C5/q']}]
                        },
            {
                            groups:[{notes:['B4/w']}]
                        },
            ],
        copyrightInfo: ""
        }
}
