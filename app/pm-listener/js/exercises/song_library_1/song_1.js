function generateExerciseForKotlin() {
    return {
        tempo: 110,
        notes: [
            {noteNumber: noteNumbers.E4, duration: durations.h},
            {noteNumber: noteNumbers.D4, duration: durations.h},

            {noteNumber: noteNumbers.C4, duration: durations.w},

            {noteNumber: noteNumbers.E4, duration: durations.h},
            {noteNumber: noteNumbers.D4, duration: durations.h},

            {noteNumber: noteNumbers.C4, duration: durations.w},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},

            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.h},
            {noteNumber: noteNumbers.D4, duration: durations.h},

            {noteNumber: noteNumbers.C4, duration: durations.w},
        ]
    }
}

var noteNumbers = {
  C4: 60,
  D4: 62,
  E4: 64,
  F4: 65,
  G4: 67,
  A4: 69,
  B4: 71,
  C5: 72
}

var durations = {
  q: 1.0,
  h: 2.0,
  w: 4.0
}

function generateExerciseEasyScoreCode() {
    return {
        title: "Hot Cross Buns",
        author: "Practicing Musician Example Author",
        time_signature: "4/4",
        tempo: 110,
        bars: [
            {
                extra_attributes:[{name:'time_signature',value:'4/4'},{name:'clef',value:'treble'},{name:'key_signature',value:"C"}],
                            groups:[{notes:['E4/h','D4/h']}]
            },
            {
                            groups:[{notes:['C4/w']}]
                        },
            {
                            groups:[{notes:['E4/h','D4/h']}]
            },
            {
                            groups:[{notes:['C4/w']}]
                        },
            {
                            groups:[{notes:['C4/q','C4/q','C4/q','C4/q']}]
                        },
            {
                            groups:[{notes:['D4/q','D4/q','D4/q','D4/q']}]
                        },
            {
                            groups:[{notes:['E4/h','D4/h']}]
            },
            {
                            groups:[{notes:['C4/w']}]
                        },
            ],
        copyrightInfo: ""
        }
}
