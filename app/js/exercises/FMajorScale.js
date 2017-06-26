var generatedExercise = null

function generateKotlinExercise() {
    var exercise = new PracticingMusician.com.practicingmusician.exercises.ExerciseDefinition()
    exercise.tempo = 120.0;
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(65, 1.0, 'F4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(67, 1.0, 'G4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(69, 1.0, 'A4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(70, 1.0, 'Bb4/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Barline());
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(72, 1.0, 'C5/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(74, 1.0, 'D5/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(76, 1.0, 'E5/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(77, 1.0, 'F5/q'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Barline());
    return exercise
}