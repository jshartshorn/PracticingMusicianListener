var generatedExercise = null

function generateKotlinExercise() {
    var exercise = new PracticingMusician.com.practicingmusician.exercises.ExerciseDefinition()
    exercise.tempo = 110.0;
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(65, 1.0, 'f/4'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(67, 1.0, 'g/4'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(69, 1.0, 'a/4'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(70, 1.0, 'Bb/4'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Barline());
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(72, 1.0, 'c/5'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(74, 1.0, 'd/5'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(76, 1.0, 'e/5'));
    exercise.notationItems.add_11rb$(new PracticingMusician.com.practicingmusician.notes.Note(77, 1.0, 'f/5'));
    return exercise
}