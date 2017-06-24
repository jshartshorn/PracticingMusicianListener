package com.practicingmusician

import com.practicingmusician.audio.AudioManager
import com.practicingmusician.exercises.ExerciseManager
import com.practicingmusician.steppable.TimeKeeper

/**
 * Created by jn on 6/5/17.
 */

class App {
    val audioManager = AudioManager()

    var exerciseManager = ExerciseManager(audioManager)


    /*
      This should be called by a button on the UI

      If the timeKeeper is currently stopped (including on first run), the exerciseManager is set up, and then run

      If the timeKeeper is running, the manager is stopped (which also triggers the finishedActions
     */

    @JsName("toggleState")
    fun toggleState() {
        when (exerciseManager.timeKeeper.state) {
            TimeKeeper.TimeKeeperState.Stopped -> {
                exerciseManager.createSteppables()
                exerciseManager.setup()
                exerciseManager.loadExercise()

                exerciseManager.run()
            }
            TimeKeeper.TimeKeeperState.Running -> {
                exerciseManager.stop()
            }
        }
    }

}