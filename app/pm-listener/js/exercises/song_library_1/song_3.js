function generateExerciseForKotlin() {
    return {
        tempo: 100,
        count_off: 8,
        time_signature: 4,
        notes: [
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.h},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.h},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.h},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.h},

            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.h},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.h},

            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},

            {noteNumber: noteNumbers.F4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},
            {noteNumber: noteNumbers.D4, duration: durations.q},

            {noteNumber: noteNumbers.C4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},
            {noteNumber: noteNumbers.G4, duration: durations.q},

            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.q},
            {noteNumber: noteNumbers.E4, duration: durations.h},
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
        title: "Lightly Row",
        author: "Franz Wiedemann (German Folk Song)",
        time_signature: "4/4",
        tempo: 100,
        systems: [
          {bars:
            [{
                extra_attributes:{
                  time_signature: '4/4',
                  clef: 'treble',
                  key_signature: 'C'
                },
                groups:[{notes:['G4/q','E4/q','E4/h']}]
            },
            { groups:[{notes:['F4/q','D4/q','D4/h']}] },
            { groups:[{notes:['C4/q','D4/q','E4/q','F4/q']}] },
            { groups:[{notes:['G4/q','G4/q','G4/h']}] },
            ]},

          {bars: [{ groups:[{notes:['G4/q','E4/q','E4/q','E4/q']}] },
            { groups:[{notes:['F4/q','D4/q','D4/q','D4/q']}] },
            { groups:[{notes:['C4/q','E4/q','G4/q','G4/q']}] },
            { groups:[{notes:['E4/q','E4/q','E4/h']}] },]},

          {bars: [{ groups:[{notes:['D4/q','D4/q','D4/q','D4/q']}] },
            { groups:[{notes:['D4/q','E4/q','F4/h']}] },
            { groups:[{notes:['E4/q','E4/q','E4/q','E4/q']}] },
            { groups:[{notes:['E4/q','F4/q','G4/h']}] },]},

          {bars: [{ groups:[{notes:['G4/q','E4/q','E4/q','E4/q']}] },
            { groups:[{notes:['F4/q','D4/q','D4/q','D4/q']}] },
            { groups:[{notes:['C4/q','E4/q','G4/q','G4/q']}] },
            { groups:[{notes:['E4/q','E4/q','E4/h']}] },]},
        ],
        copyrightInfo: ""
        }
}
