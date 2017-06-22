//CURRENTLY NOT USED -- GENERATED IN KOTLIN INSTEAD

function getExerciseNotes() {
    var notes = [
      // A quarter-note C.
      new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),
      // A quarter-note D.
      new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),

      new VF.StaveNote({clef: "treble", keys: ["e/4"], duration: "q" }),

      new VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q" }),

      new VF.BarNote(),

      new VF.StaveNote({clef: "treble", keys: ["g/4"], duration: "q" }),

      new VF.StaveNote({clef: "treble", keys: ["a/4"], duration: "q" }),

      new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q" }),

      new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q" }),

    ];

    return {
        notes: notes,
        beats: 8
    }
}

