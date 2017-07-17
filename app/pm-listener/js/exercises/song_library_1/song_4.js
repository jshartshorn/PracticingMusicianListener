function generateExerciseForKotlin() {
    return {
        tempo: 112,
        count_off: 7,
        time_signature: 4,
        notes: [
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.A4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.A4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.h},
            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.A4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.A4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.h},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.h},
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
        title: "A Tisket, a Tasket",
        author: "American Nursery Rhyme Arr: Van Alexander",
        time_signature: "4/4",
        tempo: 112,
        systems: [
          {
            bars: [
              {
                extra_attributes:{
                  pickup_bar: true,
                  alternate_timeSignature:"1/4",
                  time_signature:'4/4',
                  clef:'treble',
                  key_signature:"C"
                  },
                groups:[{notes:['G4/q']}]
              },
              { groups:[{notes:['G4/h','E4/q','A4/q']}] },
              { groups:[{notes:['G4/h','E4/q','F4/q']}] },
              { groups:[{notes:['G4/q','G4/q','E4/q','A4/q']}] },
              { groups:[{notes:['G4/h','E4/q','E4/q']}] },
            ],
          },

          {
            bars: [
              { groups:[{notes:['F4/q','F4/q','D4/q','D4/q']}] },
              { groups:[{notes:['F4/q','F4/q','D4/q','D4/q']}] },
              { groups:[{notes:['G4/q','F4/q','E4/q','D4/q']}] },
              { groups:[{notes:['E4/h','C4/q','G4/q']}] },
            ],
          },

          {
            bars: [
              { groups:[{notes:['G4/h','E4/q','A4/q']}] },
              { groups:[{notes:['G4/h','E4/q','F4/q']}] },
              { groups:[{notes:['G4/q','G4/q','E4/q','A4/q']}] },
              { groups:[{notes:['G4/h','E4/q','E4/q']}] },
            ],
          },

          {
            bars: [
              { groups:[{notes:['F4/q','F4/q','D4/q','D4/q']}] },
              { groups:[{notes:['F4/q','F4/q','D4/q','D4/q']}] },
              { groups:[{notes:['G4/q','F4/q','E4/q','D4/q']}] },
              { groups:[{notes:['E4/h','C4/h']}] },
            ],
          },
        ],
        copyrightInfo: ""
        }
}
