function generateExerciseForKotlin() {
    return {
    //TODO: make these match
        tempo: 110,
        count_off: 5,
        time_signature: 3,
        notes: [
            {noteNumber: noteNumbers.C4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.C5, duration: durations.h},
            {noteNumber: noteNumbers.C4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.C5, duration: durations.h},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.C4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.C5, duration: durations.h},
            {noteNumber: noteNumbers.A4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.h},
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
        title: "Good Morning to You",
        author: "Music: Ernst Richter / Lyrics: Abbie Farwell Brown ",
        time_signature: "3/4",
        tempo: 100,

        systems: [

          {
            bars:
            [
            {
                extra_attributes:{

                  pickup_bar: true,
                  time_signature: "3/4",
                  clef: "treble",
                  key_signature: "C",
                  alternate_timeSignature:"1/4"

                  },
                groups:[{notes:['C4/q']}],

            },
            { groups:[{notes:['C4/q','E4/q','G4/q']}] },
            { groups:[{notes:['C5/h','C4/q']}] },

            { groups:[{notes:['C4/q','E4/q','G4/q']}] },
            { groups:[{notes:['C5/h','G4/q']}] },
            ]
          },

          {
          bars:[
            { groups:[{notes:['G4/q','F4/q','D4/q']}] },
            { groups:[{notes:['E4/q','C4/q','G4/q']}] },

            { groups:[{notes:['G4/q','F4/q','D4/q']}] },
            { groups:[{notes:['E4/q','C4/q','C4/q']}] },
          ]
          },
          {
          bars:[
            { groups:[{notes:['C4/q','E4/q','G4/q']}] },
            { groups:[{notes:['C5/h','A4/q']}] },

            { groups:[{notes:['G4/q','F4/q','D4/q']}] },
            {
              groups:[{notes:['C4/h']}],
              extra_attributes: {
                            alternate_timeSignature:"2/4"
              }
              },
          ]
          }

        ],
        copyrightInfo: ""
        }
}
