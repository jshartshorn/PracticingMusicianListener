package com.practicingmusician.exercises

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.finals.BufferManager
import com.practicingmusician.finals.CompareEngine
import com.practicingmusician.finals.IncrementalBufferManager
import com.practicingmusician.finals.IncrementalComparisonEngine
import com.practicingmusician.notes.Barline
import com.practicingmusician.steppable.Metronome
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.TimeKeeperAnalyzer
import com.practicingmusician.notes.Note
import com.practicingmusician.steppable.TimeKeeper

external object VexFlowUtil
external fun addFeedbackItem(beat : Double, item : String)
external fun clearFeedbackItems()
external val generatedExercise : ExerciseDefinition


/**
 * Created by jn on 6/6/17.
 */
class ExerciseManager(am : AudioManager) : TimeKeeperAnalyzer {

    //The current exercise that has been loaded by the page
    var currentExercise : ExerciseDefinition? = null

    //these get reset in createSteppables before every run
    var timeKeeper = TimeKeeper()
    var metronome = Metronome()
    var pitchTracker = PitchTracker()

    var bufferManager = IncrementalBufferManager()
    var comparisonEngine = IncrementalComparisonEngine()

    //the audio manager (which manages playback of audio gets set in the initializer
    var audioManager = am

    init {
        println("Init")
    }

    //called before each run of the exercise -- resets values by creating new objects
    fun createSteppables() {
        timeKeeper = TimeKeeper()
        metronome = Metronome()
        pitchTracker = PitchTracker()

        bufferManager = IncrementalBufferManager()
        comparisonEngine = IncrementalComparisonEngine()

        lastAnalysisTimestamp = Double.MIN_VALUE
    }

    fun setup() {
        println("Setup")

        //clear the existing feedback items on the screen
        clearFeedbackItems()

        //make sure the metronome has a reference to the audio manager so that it can play audio
        metronome.audioManager = audioManager

        //add steppables to the timeKeeper that will get called on each step
        timeKeeper.steppables.add(metronome)
        timeKeeper.steppables.add(pitchTracker)

        //after each step, analysis can happen -- this will make sure analyze(timestamp) is called after each step
        timeKeeper.analyzers.add(this)


        //These actions are called when the timeKeeper is running and then the state is set to Stopped
        //This will happen at the end of a run, or if the pause/stop button is pressed
        timeKeeper.finishedActions.add {

            //make sure any future audio calls are cancelled (that would happen after the current timestamp)
            audioManager.cancelAllAudio()

            //cancel any future UI calls
            metronome.cancelAllUIUpdates()

            //Find the length of the samples in seconds
            val samplesLength = (pitchTracker.samples.count() / 44100.0)
            println("Total samples recorded: " + pitchTracker.samples.count() + " length: " + samplesLength)

            //set the bufferManager tempo so that it can do informed analysis
            bufferManager.tempo = metronome.tempo

            //convert the buffer of samples into Note objects
            val notesFromSamplesBuffer = bufferManager.convertSamplesBufferToNotes(pitchTracker.samples)
            println("Notes: ")
            notesFromSamplesBuffer.forEach {
                println("Note: " + it.noteNumber + " for " + it.duration)
            }


            currentExercise?.let {
                println("Comparing...")

                //compare the notes array in the exercise to the notes that were converted from the sample buffer
                val results = comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer)
                println("Results $results")

//                comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer.subList(0,2)).feedbackItems.forEach {
//                    val beat = it.beat
//                    println("Feedback item at $beat")
//                    addFeedbackItem(beat,it.feedbackItemType)
//                }
//                comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer.subList(2,notesFromSamplesBuffer.count() - 1)).feedbackItems.forEach {
//                    val beat = it.beat
//                    println("Feedback item at $beat")
//                    addFeedbackItem(beat,it.feedbackItemType)
//                }

                //add the feedback items to the screen so that the user can see them
                results.feedbackItems.forEach {
                    val beat = it.beat
                    println("Feedback item at $beat")
                    addFeedbackItem(beat,it.feedbackItemType)
                }

            }
        }

        //do setup on the metronome and pitchTracker
        metronome.setup()

        pitchTracker.setup()
    }

    @JsName("run")
    fun run() {
        metronome.start()
        pitchTracker.start()
        timeKeeper.start()
    }

    fun stop() {
        timeKeeper.stop()
        metronome.stop()
        pitchTracker.stop()
    }

    @JsName("loadExercise")
    fun loadExercise() {

        //get the exercise from an external JavaScript source
        val exercise = generatedExercise

        //get just the notes (not barlines, etc) from the notation items
        exercise.notes = (exercise.notationItems.filter { it is Note } as List<Note>).toMutableList()

        //set our current exercise to what we just loaded
        currentExercise = exercise

        currentExercise?.let {

            //sync the tempos from the exercise to the objects that need to know the tempo
            metronome.tempo = it.tempo
            bufferManager.tempo = it.tempo

            //make sure the timeKeeper only runs for the length of the exercise (plus the preroll countoff)
            timeKeeper.runForTime = it.getLength() + it.prerollLength()

            //don't track pitch during the preroll countoff
            pitchTracker.lengthOfPrerollToIgnore = it.prerollLength()
            println("Loaded exercise of length " + timeKeeper.runForTime)
        }
    }


    //NOT USED -- LOADING IN JS INSTEAD
    fun loadSampleExercise() {
        val exercise = ExerciseDefinition()
        exercise.tempo = 110.0
//        exercise.notes.add(Note(69,1.0))
//        exercise.notes.add(Note(70,1.0))
//        exercise.notes.add(Note(69,1.0))
//        exercise.notes.add(Note(68,1.0))
//        exercise.notes.add(Note(64,1.0))

//        exercise.notes.add(Note(65,1.0))
//        exercise.notes.add(Note(67,1.0))
//        exercise.notes.add(Note(69,1.0))
//        exercise.notes.add(Note(70,1.0))
//        exercise.notes.add(Note(72,1.0))


        exercise.notationItems.add(Note(60,1.0,"c/4"))
        exercise.notationItems.add(Note(62,1.0,"d/4"))
        exercise.notationItems.add(Note(64,1.0,"e/4"))
        exercise.notationItems.add(Note(65,1.0,"f/4"))

        exercise.notationItems.add(Barline())

        exercise.notationItems.add(Note(67,1.0,"g/4"))
        exercise.notationItems.add(Note(69,1.0,"a/4"))
        exercise.notationItems.add(Note(71,1.0,"b/4"))
        exercise.notationItems.add(Note(72,1.0,"c/5"))

        //var n = VexFlowUtil.asDynamic().notesFromKotlinNotationItems(exercise.notationItems)

        //console.log("Got back: " + n)

        exercise.notes = (exercise.notationItems.filter { it is Note } as List<Note>).toMutableList()

        //console.log("Exercise notes: " + exercise.notes)

        currentExercise = exercise
    }

    var lastAnalysisTimestamp = Double.MIN_VALUE

    //called from timeKeeper.analyzers
    override fun analyze(timestamp: Double) {
        if (timestamp - lastAnalysisTimestamp > 500) {
            lastAnalysisTimestamp = timestamp
        } else {
            return
        }
        println("Analyzing at " + timestamp)

        //TODO: probably don't want to do this every frame -- maybe every .5 seconds?
        currentExercise?.let {

            println("Samples length: " + pitchTracker.samples.count())

            val notesFromSamplesBuffer = bufferManager.convertSamplesBufferToNotes(pitchTracker.samples)

            //println("Notes from samples buffer length: " + notesFromSamplesBuffer.count())

            val results = comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer)
            //println("Results $results")

            clearFeedbackItems()

            results.feedbackItems.forEach {
                val beat = it.beat
                //println("Feedback item at $beat")
                addFeedbackItem(beat,it.feedbackItemType)
            }
        }


        //println("Pitch is " + pitch.currentPitch)
    }

}