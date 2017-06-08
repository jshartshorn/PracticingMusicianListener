package com.practicingmusician.tests

import com.practicingmusician.steppable.PitchTracker

/**
 * Created by jn on 6/7/17.
 */
object PitchTrackerTest {

    @JsName("runTest")
    fun runTest() {
        val tracker = PitchTracker()

        for (i in 24..1024 step 17) {
            //tracker.mapNewBufferToSamples(listOf<Double>(),i.toDouble())
        }

        println("Samples: " + tracker.samples.count())
    }

    @JsName("toggleTest")
    fun toggleTest() {


    }

}

class PitchTrackerTestClass {
    val tracker = PitchTracker()

}