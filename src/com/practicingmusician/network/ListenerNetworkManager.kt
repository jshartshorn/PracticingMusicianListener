package com.practicingmusician.network

import com.practicingmusician.finals.CompareResults


/**
 * Created by jn on 7/5/17.
 */

external fun networkRequest(url : String, jsonString: String)

data class NetworkRequestTransportObject(val UserID : Int, val ExerciseID: Int, val attempted : Int, val correct : Int)

object ListenerNetworkManager {

    val endpoint = "localhost" //change this to practicingMusician.com

    val mapTest = mapOf("test" to 1, "test2" to 4)

    fun makePostRequest(urlString : String, jsonString : String) {
        networkRequest(urlString, jsonString) //call the javascript
    }

   fun buildAndSendRequest(results : CompareResults) {
       val fakeUserID = 1 //TODO: real values
       val fakeExerciseID = 1 //TODO : real values

       val transportObject = NetworkRequestTransportObject(fakeUserID,fakeExerciseID,results.attempted,results.correct)

       ListenerNetworkManager.makePostRequest(endpoint, JSON.stringify(transportObject))
   }

}