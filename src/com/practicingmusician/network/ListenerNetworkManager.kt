package com.practicingmusician.network

import com.practicingmusician.ListenerApp
import com.practicingmusician.finals.CompareResults
import com.practicingmusician.finals.ResultsForDatabase


/**
 * Created by jn on 7/5/17.
 */

external fun networkRequest(url : String, jsonString: String)
external val listenerApp : ListenerApp

object ListenerNetworkManager {

    val mapTest = mapOf("test" to 1, "test2" to 4)

    fun makePostRequest(urlString : String, jsonString : String) {
        networkRequest(urlString, jsonString) //call the javascript
    }

   fun buildAndSendRequest(results : CompareResults) {

       val dbResults = results.generateResultForDatabase()
       dbResults.userID = listenerApp.parameters.userID
       dbResults.exerciseID = listenerApp.parameters.exerciseID

       ListenerNetworkManager.makePostRequest(listenerApp.parameters.databaseEndpoint, JSON.stringify(dbResults))
   }

}