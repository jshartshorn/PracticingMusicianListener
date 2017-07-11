package com.practicingmusician.network

import com.practicingmusician.finals.CompareResults
import com.practicingmusician.finals.ResultsForDatabase


/**
 * Created by jn on 7/5/17.
 */

external fun networkRequest(url : String, jsonString: String)


object ListenerNetworkManager {

    val endpoint = "localhost" //change this to practicingMusician.com

    val mapTest = mapOf("test" to 1, "test2" to 4)

    fun makePostRequest(urlString : String, jsonString : String) {
        networkRequest(urlString, jsonString) //call the javascript
    }

   fun buildAndSendRequest(results : CompareResults) {
       val fakeUserID = 1 //TODO: real values
       val fakeExerciseID = 1 //TODO : real values

       val dbResults = results.generateResultForDatabase()
       dbResults.userID = fakeUserID
       dbResults.exerciseID = fakeExerciseID


       ListenerNetworkManager.makePostRequest(endpoint, JSON.stringify(dbResults))
   }

}