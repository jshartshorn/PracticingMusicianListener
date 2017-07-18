package com.practicingmusician.exercises

import com.practicingmusician.ListenerApp
import com.practicingmusician.audio.AudioManager
import com.practicingmusician.finals.IncrementalBufferManager
import com.practicingmusician.finals.IncrementalComparisonEngine
import com.practicingmusician.network.ListenerNetworkManager
import com.practicingmusician.steppable.Metronome
import com.practicingmusician.steppable.PitchTracker
import com.practicingmusician.steppable.TimeKeeperAnalyzer
import com.practicingmusician.notes.Note
import com.practicingmusician.pm_log
import com.practicingmusician.steppable.TimeKeeper
import kotlin.browser.window

external val listenerApp : ListenerApp

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
        pm_log("Init")
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
        pm_log("Setup")

        //clear the existing feedback items on the screen
        listenerApp.clearFeedbackItems()

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
            pm_log("Total samples recorded: " + pitchTracker.samples.count() + " length: " + samplesLength)

            //set the bufferManager tempo so that it can do informed analysis
            bufferManager.tempo = metronome.tempo

            //convert the buffer of samples into Note objects
            val notesFromSamplesBuffer = bufferManager.convertSamplesBufferToNotes(pitchTracker.samples)
            pm_log("Notes: ")
            notesFromSamplesBuffer.forEach {
                pm_log("Note: " + it.note.noteNumber + " for " + it.note.duration + " at " + it.positionInBeats)
            }


            currentExercise?.let {
                pm_log("Comparing...")

                //compare the notes array in the exercise to the notes that were converted from the sample buffer
                val results = comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer)

                listenerApp.clearFeedbackItems()

                //add the feedback items to the screen so that the user can see them
                results.feedbackItems.forEach {
                    //pm_log("Feedback item at $beat")
                    listenerApp.addFeedbackItem(it)
                }

                window.alert("Your results are: " + results.correct + "/" + results.attempted)

                //contact the server with a network request
                ListenerNetworkManager.buildAndSendRequest(results)
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
        pm_log("Loading exericse:")

        val generatedExercise = listenerApp.generatedExercise

        //pm_log("Tempo: " + exercise.tempo)
        val exerciseDefinition = ExerciseDefinition()
        exerciseDefinition.tempo = generatedExercise.tempo
        exerciseDefinition.prerollLengthInBeats = generatedExercise.count_off

        //TODO: load the UserSettings tempo

        val jsNotes = generatedExercise.notes

        exerciseDefinition.notes = jsNotes.map {
            Note(it.noteNumber,it.duration)
        }.toMutableList()

        pm_log("Loaded " + exerciseDefinition.notes.count() + " notes")
        pm_log(exerciseDefinition.notes)

        //set our current exercise to what we just loaded
        currentExercise = exerciseDefinition

        currentExercise?.let {
            //sync the tempos from the exercise to the objects that need to know the tempo
            metronome.tempo = it.tempo

            console.log("Testing time sig:" )
            console.log(generatedExercise)

            metronome.timeSignature = generatedExercise.time_signature
            metronome.prerollBeats = generatedExercise.count_off

            bufferManager.tempo = it.tempo

            //make sure the timeKeeper only runs for the length of the exercise (plus the preroll countoff)
            timeKeeper.runForTime = it.getLength() + it.prerollLength() + pitchTracker.latencyTime

            //don't track pitch during the preroll countoff
            pitchTracker.lengthOfPrerollToIgnore = it.prerollLength()
            pm_log("Loaded exercise of length " + timeKeeper.runForTime)
        }
    }


    var lastAnalysisTimestamp = Double.MIN_VALUE

    //called from timeKeeper.analyzers
    override fun analyze(timestamp: Double) {
        if (timestamp - lastAnalysisTimestamp > 200) {
            lastAnalysisTimestamp = timestamp
        } else {
            return
        }

        currentExercise?.let {

            pm_log("Samples length: " + pitchTracker.samples.count())

            val notesFromSamplesBuffer = bufferManager.convertSamplesBufferToNotes(pitchTracker.samples)

            //pm_log("Notes from samples buffer length: " + notesFromSamplesBuffer.count())

            val results = comparisonEngine.compareNoteArrays(it.notes,notesFromSamplesBuffer,isCurrentlyRunning = true)
            //pm_log("Results $results")

            listenerApp.clearFeedbackItems()

            results.feedbackItems.forEach {
                listenerApp.addFeedbackItem(it)
            }
        }


        //pm_log("Pitch is " + pitch.currentPitch)
    }

}
