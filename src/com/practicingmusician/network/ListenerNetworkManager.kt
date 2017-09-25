package com.practicingmusician.network

import com.practicingmusician.ListenerApp
import com.practicingmusician.finals.CompareResults
import com.practicingmusician.finals.ResultsForDatabase


/**
 * Created by jn on 7/5/17.
 */

external fun networkRequest(url : String, data: dynamic)
external val listenerApp : ListenerApp

object ListenerNetworkManager {

    val mapTest = mapOf("test" to 1, "test2" to 4)

    fun makePostRequest(urlString : String, data : PerformanceWrapper) {
        networkRequest(urlString, data) //call the javascript
    }

   fun buildAndSendRequest(results : CompareResults) {

        val dbResults = results.generateResultForDatabase()
        dbResults.userID = listenerApp.parameters.userID
        dbResults.exerciseID = listenerApp.parameters.exerciseID

        val performanceWrapper = PerformanceWrapper(performance = dbResults)

        ListenerNetworkManager.makePostRequest(listenerApp.parameters.databaseEndpoint, performanceWrapper)
   }

}

data class PerformanceWrapper(val performance : ResultsForDatabase)
