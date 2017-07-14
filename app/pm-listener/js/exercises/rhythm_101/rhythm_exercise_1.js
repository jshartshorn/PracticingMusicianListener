function generateExerciseForKotlin() {
    return {
        tempo: 110,
        notes: [
            {noteNumber: 71, duration: 4.0},
            {noteNumber: 71, duration: 4.0},
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 71, duration: 2.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
            {noteNumber: 71, duration: 1.0},
        ]
    }
}

function generateExerciseEasyScoreCode() {
    return {
        title: "Rhythm Exercise 1",
        author: "Jake Douglass",
        time_signature: "4/4",
        tempo: 110,
        systems: [

          {
              bars: [
                {
                    extra_attributes:{time_signature:'4/4',clef:'percussion',key_signature:"C"},
                    groups:[{notes:['B4/w']}]
                },
                {
                                groups:[{notes:['B4/w']}]
                            },
                {
                                groups:[{notes:['B4/h','B4/h']}]
                            },
                {
                                groups:[{notes:['B4/q','B4/q','B4/q','B4/q']}]
                            },
            ],
          }

        ],

        copyrightInfo: "© Copyright 2017"
        }
}
