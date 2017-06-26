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


//This is used

var generatedExercise = null

function generateKotlinExercise() {
    var exercise = new PracticingMusician.com.practicingmusician.exercises.ExerciseDefinition()
    exercise.tempo = 110.0;
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(60, 1.0, 'C4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(62, 1.0, 'D4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(64, 1.0, 'E4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(65, 1.0, 'F4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Barline());
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(67, 1.0, 'G4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(69, 1.0, 'A4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(71, 1.0, 'B4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(72, 1.0, 'C5/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Barline());
    return exercise
}